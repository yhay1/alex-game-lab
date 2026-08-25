import type { EntityDefinition, GameDefinition, SceneDefinition } from '@/lib/game-definition'

export type SceneMutation =
  | { type: 'create'; name: string; duplicateFromId?: string }
  | { type: 'rename'; sceneId: string; name: string }
  | { type: 'duplicate'; sceneId: string; name?: string }
  | { type: 'delete'; sceneId: string }
  | { type: 'set-default'; sceneId: string }
  | { type: 'add-entity'; sceneId: string; name: string; assetId?: string }
  | { type: 'update-entity'; sceneId: string; entityId: string; name?: string; visible?: boolean; x?: number; y?: number }
  | { type: 'duplicate-entity'; sceneId: string; entityId: string }
  | { type: 'delete-entity'; sceneId: string; entityId: string }

const safeName = (value: string, fallback: string) => value.trim().slice(0, 80) || fallback
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export function applySceneMutation(input: GameDefinition, mutation: SceneMutation): GameDefinition {
  const next = clone(input)
  const findScene = (id: string) => next.scenes.find((scene) => scene.id === id)
  if (mutation.type === 'create') {
    const source = mutation.duplicateFromId ? findScene(mutation.duplicateFromId) : undefined
    const id = `scene-${crypto.randomUUID()}`
    next.scenes.push({ id, name: safeName(mutation.name, 'New Scene'), entities: source ? clone(source.entities) : [] })
    return next
  }
  if (mutation.type === 'rename') { const scene = findScene(mutation.sceneId); if (!scene) throw new Error('Scene not found'); scene.name = safeName(mutation.name, scene.name); return next }
  if (mutation.type === 'duplicate') { const scene = findScene(mutation.sceneId); if (!scene) throw new Error('Scene not found'); next.scenes.push({ ...clone(scene), id: `scene-${crypto.randomUUID()}`, name: safeName(mutation.name ?? `${scene.name} Copy`, 'Copied Scene') }); return next }
  if (mutation.type === 'delete') { if (next.scenes.length === 1) throw new Error('At least one scene is required'); if (next.metadata.startingSceneId === mutation.sceneId) throw new Error('Set another default scene before deleting this one'); next.scenes = next.scenes.filter((scene) => scene.id !== mutation.sceneId); return next }
  if (mutation.type === 'set-default') { if (!findScene(mutation.sceneId)) throw new Error('Scene not found'); next.metadata.startingSceneId = mutation.sceneId; return next }
  const scene = findScene(mutation.sceneId); if (!scene) throw new Error('Scene not found')
  if (mutation.type === 'add-entity') { const entity: EntityDefinition = { id: `entity-${crypto.randomUUID()}`, name: safeName(mutation.name, 'New Object'), components: { transform: { position: { x: 100, y: 100 } }, ...(mutation.assetId ? { sprite: { assetId: mutation.assetId } } : {}) } }; scene.entities.push(entity); return next }
  const entity = scene.entities.find((item) => item.id === mutation.entityId); if (!entity) throw new Error('Object not found')
  if (mutation.type === 'duplicate-entity') { scene.entities.push({ ...clone(entity), id: `entity-${crypto.randomUUID()}`, name: `${entity.name} Copy` }); return next }
  if (mutation.type === 'delete-entity') { scene.entities = scene.entities.filter((item) => item.id !== mutation.entityId); return next }
  entity.name = mutation.name === undefined ? entity.name : safeName(mutation.name, entity.name); entity.components.transform.position = { x: mutation.x ?? entity.components.transform.position.x, y: mutation.y ?? entity.components.transform.position.y }; if (mutation.visible !== undefined) entity.components.visible = mutation.visible; return next
}

export function listSceneEntities(definition: GameDefinition, sceneId: string) { return definition.scenes.find((scene) => scene.id === sceneId)?.entities ?? [] }
export type { SceneDefinition }
