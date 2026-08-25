import type { EntityDefinition, GameDefinition } from '@/lib/game-definition'

export type CustomizePatch = {
  entityId: string
  transform?: { x?: number; y?: number; rotation?: number; scaleX?: number; scaleY?: number }
  visibility?: { visible?: boolean; layer?: number }
  movement?: { speed?: number; jumpForce?: number }
  health?: { max?: number }
  combat?: { damage?: number; cooldown?: number }
  abilities?: { primary?: string; secondary?: string }
  appearance?: { assetId?: string; tint?: string }
  behavior?: { kind?: string }
}

const ranges: Record<string, [number, number]> = { x: [-100000, 100000], y: [-100000, 100000], rotation: [-360, 360], scaleX: [0.01, 100], scaleY: [0.01, 100], layer: [-100, 100], speed: [0, 10000], jumpForce: [0, 10000], max: [1, 1000000], damage: [0, 1000000], cooldown: [0, 60000] }

export function validateCustomizePatch(patch: CustomizePatch): string[] {
  const errors: string[] = []
  if (!patch || typeof patch.entityId !== 'string' || !patch.entityId) errors.push('entityId is required.')
  for (const group of ['transform', 'visibility', 'movement', 'health', 'combat'] as const) {
    const values = patch?.[group]
    if (!values) continue
    for (const [key, value] of Object.entries(values)) if (typeof value === 'number') { const range = ranges[key]; if (!range || !Number.isFinite(value) || value < range[0] || value > range[1]) errors.push(`${group}.${key} is outside its supported range.`) }
  }
  if (patch?.appearance?.assetId !== undefined && typeof patch.appearance.assetId !== 'string') errors.push('appearance.assetId must be a string.')
  return errors
}

export function applyCustomizePatch(definition: GameDefinition, patch: CustomizePatch): GameDefinition {
  const errors = validateCustomizePatch(patch)
  if (errors.length) throw new Error(errors.join(' '))
  let found = false
  const scenes = definition.scenes.map((scene) => ({ ...scene, entities: scene.entities.map((entity) => {
    if (entity.id !== patch.entityId) return entity
    found = true
    const components = { ...entity.components }
    const transform = { ...components.transform, position: { ...components.transform.position } }
    if (patch.transform?.x !== undefined) transform.position.x = patch.transform.x
    if (patch.transform?.y !== undefined) transform.position.y = patch.transform.y
    if (patch.transform?.rotation !== undefined) transform.rotation = patch.transform.rotation
    if (patch.transform?.scaleX !== undefined || patch.transform?.scaleY !== undefined) transform.scale = { x: patch.transform.scaleX ?? transform.scale?.x ?? 1, y: patch.transform.scaleY ?? transform.scale?.y ?? 1 }
    components.transform = transform
    if (patch.visibility?.layer !== undefined || patch.appearance?.assetId || patch.appearance?.tint) { const existingSprite = components.sprite as { assetId: string; layer?: number; tint?: string } | undefined; if (existingSprite?.assetId || patch.appearance?.assetId) components.sprite = { assetId: existingSprite?.assetId ?? patch.appearance?.assetId ?? '', ...(existingSprite?.layer !== undefined || patch.visibility?.layer !== undefined ? { layer: patch.visibility?.layer ?? existingSprite?.layer } : {}), ...(patch.appearance?.tint ? { tint: patch.appearance.tint } : existingSprite?.tint ? { tint: existingSprite.tint } : {}) } }
    if (patch.visibility?.visible !== undefined) components.visibility = { visible: patch.visibility.visible }
    if (patch.movement) components.movement = { ...(components.movement as object), ...patch.movement }
    if (patch.health) components.health = { ...(components.health as object), ...patch.health }
    if (patch.combat) components.combat = { ...(components.combat as object), ...patch.combat }
    if (patch.abilities) components.abilities = { ...(components.abilities as object), ...patch.abilities }
    if (patch.behavior) components.behavior = { ...(components.behavior as object), ...patch.behavior }
    return { ...entity, components } as EntityDefinition
  }) }))
  if (!found) throw new Error('Entity not found.')
  return { ...definition, scenes }
}

export function editableEntityFields(entity: EntityDefinition) {
  return { hasSprite: Boolean(entity.components.sprite), hasMovement: Boolean(entity.components.movement), hasHealth: Boolean(entity.components.health), hasCombat: Boolean(entity.components.combat), hasAbilities: Boolean(entity.components.abilities), hasBehavior: Boolean(entity.components.behavior) }
}

