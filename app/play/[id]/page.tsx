import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, getProject } from '@/lib/data/game-lab'
import { RuntimeHost } from '@/components/runtime/runtime-host'
import type { RuntimeProject } from '@/lib/runtime/types'

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  if (project.owner_id !== user.id) notFound()
  const runtimeProject: RuntimeProject = { width: 960, height: 540, startSceneId: 'main', scenes: [{ id: 'main', name: 'Rendering Test Scene', background: { top: '#101522', bottom: '#182b43' }, entities: [{ id: 'backdrop', position: { x: 0, y: 0 }, size: { x: 960, y: 540 }, color: '#101522', renderable: { layer: 0 } }, { id: 'sun', position: { x: 770, y: 70 }, size: { x: 100, y: 100 }, color: '#fbbf24', renderable: { layer: 1, shape: 'circle', opacity: 0.9 } }, { id: 'platform', position: { x: 160, y: 390 }, size: { x: 640, y: 30 }, color: '#34d399', renderable: { layer: 2, shape: 'rect' } }, { id: 'player', position: { x: 440, y: 310 }, size: { x: 48, y: 64 }, color: '#67e8f9', renderable: { layer: 3, shape: 'rect', rotation: 0 } }, { id: 'accent', position: { x: 230, y: 250 }, size: { x: 180, y: 4 }, color: '#f472b6', renderable: { layer: 4, shape: 'line', opacity: 0.8 } }] }] }
  return <RuntimeHost project={runtimeProject} />
}
