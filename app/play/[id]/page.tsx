import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, getProject } from '@/lib/data/game-lab'
import { RuntimeHost } from '@/components/runtime/runtime-host'

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  if (project.owner_id !== user.id) notFound()
  const runtimeProject = { width: 960, height: 540, startSceneId: 'main', scenes: [{ id: 'main', name: 'Main', background: '#101522', entities: [{ id: 'player', position: { x: 440, y: 230 }, size: { x: 48, y: 48 }, color: '#67e8f9' }] }] }
  return <RuntimeHost project={runtimeProject} />
}
