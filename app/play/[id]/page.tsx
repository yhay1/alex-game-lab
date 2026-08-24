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
  const runtimeProject: RuntimeProject = { width: 960, height: 540, startSceneId: 'main', scenes: [{ id: 'main', name: 'Rendering Test Scene', background: { top: '#101522', bottom: '#182b43' }, entities: [{ id: 'backdrop', position: { x: 0, y: 0 }, size: { x: 960, y: 540 }, color: '#101522', renderable: { layer: 0 } }, { id: 'sun', position: { x: 770, y: 70 }, size: { x: 100, y: 100 }, color: '#fbbf24', renderable: { layer: 1, shape: 'circle', opacity: 0.9 } }, { id: 'platform', position: { x: 160, y: 390 }, size: { x: 640, y: 30 }, color: '#34d399', solid: true, renderable: { layer: 2, shape: 'rect' } }, { id: 'player', kind: 'player', health: 5, position: { x: 440, y: 310 }, size: { x: 48, y: 64 }, color: '#67e8f9', player: { speed: 220, jumpForce: 420, gravity: 1100, groundY: 420 }, renderable: { layer: 3, shape: 'rect', rotation: 0 } }, { id: 'enemy', kind: 'enemy', position: { x: 650, y: 326 }, size: { x: 42, y: 64 }, color: '#fb7185', speed: 55, damage: 1, behavior: 'patrol', patrol: { from: 560, to: 760, direction: -1 }, renderable: { layer: 3, shape: 'rect' } }, { id: 'npc', kind: 'npc', position: { x: 90, y: 326 }, size: { x: 40, y: 64 }, color: '#a78bfa', renderable: { layer: 3, shape: 'rect' } }, { id: 'item', kind: 'item', position: { x: 320, y: 345 }, size: { x: 24, y: 24 }, color: '#f59e0b', renderable: { layer: 4, shape: 'circle' } }, { id: 'obstacle', kind: 'obstacle', position: { x: 520, y: 350 }, size: { x: 34, y: 40 }, color: '#94a3b8', solid: true, renderable: { layer: 3, shape: 'rect' } }, { id: 'collectible', kind: 'collectible', position: { x: 250, y: 330 }, size: { x: 22, y: 22 }, color: '#facc15', collectible: { value: 10 }, renderable: { layer: 4, shape: 'circle' } }, { id: 'accent', position: { x: 230, y: 250 }, size: { x: 180, y: 4 }, color: '#f472b6', renderable: { layer: 4, shape: 'line', opacity: 0.8 } }] }] }
  return <RuntimeHost project={runtimeProject} />
}
