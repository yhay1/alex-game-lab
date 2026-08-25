import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, getProject } from '@/lib/data/game-lab'
import { RuntimeHost } from '@/components/runtime/runtime-host'
import { projectToGameDefinition } from '@/lib/runtime/project-definition'
import { foundationToRuntime } from '@/lib/runtime/project-adapter'

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  if (project.owner_id !== user.id) notFound()
  let runtimeProject
  try { const definition = projectToGameDefinition(project); runtimeProject = foundationToRuntime({ levels: definition.scenes, entities: definition.scenes.flatMap((scene) => scene.entities), items: [], abilities: [], rules: [], assets: definition.assets }) } catch { notFound() }
  return <RuntimeHost project={runtimeProject} />
}
