import { notFound } from 'next/navigation'
import { getCurrentUser, getProject, getProjectVersion, getPublishedProject } from '@/lib/data/game-lab'
import { RuntimeHost } from '@/components/runtime/runtime-host'
import { foundationToRuntime } from '@/lib/runtime/project-adapter'
import { publishedVersionId, validateVersionData } from '@/lib/runtime/versions'
import { projectToGameDefinition } from '@/lib/runtime/project-definition'

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let project
  let isPublished = true
  try {
    project = await getPublishedProject(id)
  } catch {
    const user = await getCurrentUser()
    if (!user) notFound()
    try {
      project = await getProject(id)
      isPublished = false
    } catch { notFound() }
  }
  let runtimeProject
  try {
    if (isPublished) {
      const publishedId = publishedVersionId(project.metadata)
      const version = publishedId ? await getProjectVersion(id, publishedId).catch(() => null) : null
      const check = validateVersionData(version?.data ?? null)
      if (!version || !check.valid) notFound()
      runtimeProject = foundationToRuntime({ levels: check.definition!.scenes, entities: check.definition!.scenes.flatMap((scene) => scene.entities), items: [], abilities: [], rules: [], assets: check.definition!.assets })
    } else {
      const definition = projectToGameDefinition(project)
      runtimeProject = foundationToRuntime({ levels: definition.scenes, entities: definition.scenes.flatMap((scene) => scene.entities), items: [], abilities: [], rules: [], assets: definition.assets })
    }
  } catch { notFound() }
  return <RuntimeHost project={runtimeProject} />
}
