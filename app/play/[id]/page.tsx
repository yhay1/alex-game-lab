import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, getProject } from '@/lib/data/game-lab'
import { RuntimeHost } from '@/components/runtime/runtime-host'
import { foundationToRuntime } from '@/lib/runtime/project-adapter'
import { publishedVersionId, validateVersionData } from '@/lib/runtime/versions'
import { listProjectVersions } from '@/lib/data/game-lab'

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  if (project.owner_id !== user.id) notFound()
  let runtimeProject
  try {
    const publishedId = publishedVersionId(project.metadata)
    const version = publishedId ? (await listProjectVersions(id)).find((item) => item.id === publishedId) : null
    const definition = version?.data ?? null
    const check = validateVersionData(definition)
    if (!version || !check.valid || project.status !== 'published') notFound()
    runtimeProject = foundationToRuntime({ levels: check.definition!.scenes, entities: check.definition!.scenes.flatMap((scene) => scene.entities), items: [], abilities: [], rules: [], assets: check.definition!.assets })
  } catch { notFound() }
  return <RuntimeHost project={runtimeProject} />
}
