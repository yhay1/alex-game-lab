import { NextResponse } from 'next/server'
import { getProject, listProjectVersions, updateProject } from '@/lib/data/game-lab'
import { projectToGameDefinition } from '@/lib/runtime/project-definition'
import { nextVersionNumber, validateVersionData, versionLabel } from '@/lib/runtime/versions'

export async function GET(_: Request, { params }: { params: Promise<unknown> }) {
  const { id } = await params as { id: string }
  await getProject(id)
  return NextResponse.json({ versions: await listProjectVersions(id) })
}

export async function POST(request: Request, { params }: { params: Promise<unknown> }) {
  const { id } = await params as { id: string }
  const project = await getProject(id)
  const body = await request.json().catch(() => ({})) as { action?: string; versionId?: string; label?: string }
  const versions = await listProjectVersions(id)
  if (body.action === 'publish') {
    const definition = projectToGameDefinition(project)
    const check = validateVersionData(definition)
    if (!check.valid) return NextResponse.json({ errors: check.errors }, { status: 422 })
    const { createClient } = await import('@/lib/supabase/server'); const supabase = await createClient()
    const { data, error } = await supabase.from('game_project_versions').insert({ project_id: id, version_number: nextVersionNumber(versions), label: body.label || versionLabel(nextVersionNumber(versions)), data: definition as never, created_by: project.owner_id }).select('*').single()
    if (error) throw error
    try {
      await updateProject(id, { status: 'published', metadata: { ...(project.metadata ?? {}), published_version_id: data.id, published_at: new Date().toISOString() } as never })
    } catch (updateError) {
      await supabase.from('game_project_versions').delete().eq('id', data.id)
      throw updateError
    }
    return NextResponse.json({ version: data })
  }
  if (body.action === 'restore' && body.versionId) {
    const version = versions.find((item) => item.id === body.versionId)
    if (!version) return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    const check = validateVersionData(version.data)
    if (!check.valid) return NextResponse.json({ errors: check.errors }, { status: 422 })
    return NextResponse.json(await updateProject(id, { foundation: { gameDefinition: version.data } as never, status: 'draft', metadata: { ...(project.metadata ?? {}), published_version_id: null } as never }))
  }
  return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
}
