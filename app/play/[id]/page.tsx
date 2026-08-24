import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, getProject } from '@/lib/data/game-lab'
import { RuntimeHost } from '@/components/runtime/runtime-host'
import { foundationToRuntime } from '@/lib/runtime/project-adapter'

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  if (project.owner_id !== user.id) notFound()
  const runtimeProject = foundationToRuntime(project.foundation)
  return <RuntimeHost project={runtimeProject} />
}
