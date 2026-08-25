import type { ProjectFoundation } from '@/lib/data/game-lab-types'
import type { RuntimeEntity, RuntimeProject, RuntimeScene } from './types'

const demoEntities: RuntimeEntity[] = [
  { id: 'platform', kind: 'obstacle', position: { x: 120, y: 410 }, size: { x: 720, y: 32 }, color: '#34d399', solid: true, renderable: { layer: 2, shape: 'rect' } },
  { id: 'player', kind: 'player', position: { x: 220, y: 340 }, size: { x: 42, y: 64 }, color: '#67e8f9', health: 5, player: { speed: 220, jumpForce: 420, gravity: 1100 }, renderable: { layer: 3, shape: 'rect' } },
  { id: 'enemy', kind: 'enemy', position: { x: 610, y: 346 }, size: { x: 42, y: 64 }, color: '#fb7185', health: 3, speed: 55, damage: 1, behavior: 'patrol', patrol: { from: 520, to: 760, direction: -1 }, renderable: { layer: 3, shape: 'rect' } },
  { id: 'collectible', kind: 'collectible', position: { x: 420, y: 365 }, size: { x: 24, y: 24 }, color: '#facc15', collectible: { value: 10, once: true }, renderable: { layer: 4, shape: 'circle' } },
  { id: 'goal', kind: 'collectible', position: { x: 740, y: 250 }, size: { x: 24, y: 24 }, color: '#a78bfa', collectible: { value: 10, once: true }, renderable: { layer: 4, shape: 'circle' } },
]

export const testGameFoundation: ProjectFoundation = {
  levels: [{ id: 'main', name: 'First Run', entities: demoEntities, completion: { score: 10 } }],
  entities: demoEntities,
  items: [], abilities: [], rules: [], assets: [],
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null }
function finite(value: unknown, fallback: number) { return typeof value === 'number' && Number.isFinite(value) ? value : fallback }
function normalizeEntity(value: Record<string, unknown>, index: number): RuntimeEntity {
  const position = isRecord(value.position) ? value.position : {}
  const size = isRecord(value.size) ? value.size : {}
  return { ...value as unknown as RuntimeEntity, id: typeof value.id === 'string' && value.id.trim() ? value.id : `entity-${index + 1}`, position: { x: finite(position.x, 0), y: finite(position.y, 0) }, size: { x: Math.max(1, finite(size.x, 32)), y: Math.max(1, finite(size.y, 32)) }, color: typeof value.color === 'string' ? value.color : '#94a3b8' }
}

export function foundationToRuntime(foundation: ProjectFoundation | null | undefined): RuntimeProject {
  const rawLevels = Array.isArray(foundation?.levels) ? foundation.levels : []
  const scenes: RuntimeScene[] = rawLevels.flatMap((raw, index) => {
    if (!isRecord(raw)) return []
    const entities = Array.isArray(raw.entities) ? raw.entities.filter(isRecord).map(normalizeEntity) : []
    return [{ id: typeof raw.id === 'string' ? raw.id : `level-${index + 1}`, name: typeof raw.name === 'string' ? raw.name : `Level ${index + 1}`, entities, background: typeof raw.background === 'string' || isRecord(raw.background) ? raw.background as RuntimeScene['background'] : { top: '#101522', bottom: '#182b43' }, camera: isRecord(raw.camera) ? raw.camera as RuntimeScene['camera'] : { mode: 'follow', targetId: 'player', smoothing: 0.12 }, bounds: isRecord(raw.bounds) ? raw.bounds as RuntimeScene['bounds'] : { x: 0, y: 0, width: 960, height: 540 }, spawnPoints: Array.isArray(raw.spawnPoints) ? raw.spawnPoints as RuntimeScene['spawnPoints'] : [{ id: 'player-start', position: { x: 220, y: 340 }, tags: ['player'] }], completion: isRecord(raw.completion) ? raw.completion as RuntimeScene['completion'] : { score: 10 } }]
  })
  const safeScenes: RuntimeScene[] = scenes.length ? scenes : [{ id: 'main', name: 'First Run', entities: demoEntities, background: { top: '#101522', bottom: '#182b43' }, bounds: { x: 0, y: 0, width: 960, height: 540 }, spawnPoints: [{ id: 'player-start', position: { x: 220, y: 340 }, tags: ['player'] }], camera: { mode: 'follow', targetId: 'player', smoothing: 0.12 }, completion: { score: 10, nextSceneId: 'finish' } }, { id: 'finish', name: 'Finished', entities: demoEntities.map((entity) => ({ ...entity, position: { ...entity.position, x: entity.position.x + 20 } })), background: { top: '#14213d', bottom: '#254f70' }, bounds: { x: 0, y: 0, width: 960, height: 540 }, spawnPoints: [{ id: 'player-start', position: { x: 100, y: 340 }, tags: ['player'] }], camera: { mode: 'fixed', bounds: { x: 0, y: 0, width: 960, height: 540 } }, completion: { score: 999 } }]
  return { width: 960, height: 540, startSceneId: safeScenes[0].id, scenes: safeScenes, state: { score: 0, flags: {}, status: 'loading' } }
}
