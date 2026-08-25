import { NextResponse } from 'next/server'
import { getProject, updateProject } from '@/lib/data/game-lab'
import { projectToGameDefinition } from '@/lib/runtime/project-definition'
import { applySceneMutation, type SceneMutation } from '@/lib/runtime/scenes'
import { validateGameDefinition } from '@/lib/game-definition'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const project = await getProject(id)
    const mutation = await request.json() as SceneMutation
    const next = applySceneMutation(projectToGameDefinition(project), mutation)
    const validation = validateGameDefinition(next)
    if (!validation.valid) return NextResponse.json({ error: validation.errors.join('; ') }, { status: 400 })
    return NextResponse.json(await updateProject(id, { foundation: { ...(project.foundation ?? {}), gameDefinition: next } as unknown as import('@/lib/data/game-lab-types').GameProject['foundation'] }))
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update scenes' }, { status: 400 })
  }
}
