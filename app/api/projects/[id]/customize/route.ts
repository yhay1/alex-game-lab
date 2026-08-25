import { NextResponse } from 'next/server'
import { getProject, updateProject } from '@/lib/data/game-lab'
import { projectToGameDefinition } from '@/lib/runtime/project-definition'
import { applyCustomizePatch, type CustomizePatch } from '@/lib/runtime/customize'
import { validateGameDefinition } from '@/lib/game-definition'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const project = await getProject(id)
    const patch = await request.json() as CustomizePatch
    const definition = projectToGameDefinition(project)
    const next = applyCustomizePatch(definition, patch)
    const validation = validateGameDefinition(next)
    if (!validation.valid) return NextResponse.json({ error: validation.errors.join('; ') }, { status: 400 })
    const foundation = { ...(project.foundation ?? {}), gameDefinition: next }
    return NextResponse.json(await updateProject(id, { foundation }))
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to customize project' }, { status: 400 })
  }
}
