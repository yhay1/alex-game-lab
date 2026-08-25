export type Vector2 = { x: number; y: number }
export type Color = string

export type GameDefinition = {
  schemaVersion: '0.1'
  metadata: {
    id: string
    name: string
    description?: string
    genre: string
    version: string
    startingSceneId: string
  }
  settings: {
    viewport: { width: number; height: number }
    background: Color
    gravity?: Vector2
  }
  assets: AssetDefinition[]
  scenes: SceneDefinition[]
}

export type AssetDefinition = {
  id: string
  type: 'sprite' | 'tileset' | 'audio' | 'font'
  path: string
  width?: number
  height?: number
}

export type SceneDefinition = {
  id: string
  name: string
  entities: EntityDefinition[]
}

export type EntityDefinition = {
  id: string
  name: string
  components: {
    transform: { position: Vector2; rotation?: number; scale?: Vector2 }
    sprite?: { assetId: string; layer?: number; tint?: Color }
    collider?: { shape: 'rectangle' | 'circle'; size: Vector2; isStatic?: boolean }
    [key: string]: unknown
  }
}

export type ValidationResult = { valid: true } | { valid: false; errors: string[] }

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const isVector2 = (value: unknown): value is Vector2 => isRecord(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y)
const uniqueIds = (values: string[]) => new Set(values).size === values.length

export function validateGameDefinition(value: unknown): ValidationResult {
  const errors: string[] = []
  if (!isRecord(value)) return { valid: false, errors: ['Definition must be an object.'] }
  if (value.schemaVersion !== '0.1') errors.push('schemaVersion must be 0.1.')
  const metadata = value.metadata
  if (!isRecord(metadata)) errors.push('metadata is required.')
  else {
    for (const field of ['id', 'name', 'genre', 'version', 'startingSceneId']) if (typeof metadata[field] !== 'string' || !metadata[field]) errors.push(`metadata.${field} is required.`)
  }
  const settings = value.settings
  if (!isRecord(settings)) errors.push('settings is required.')
  else {
    if (!isRecord(settings.viewport) || !isFiniteNumber(settings.viewport.width) || settings.viewport.width <= 0 || !isFiniteNumber(settings.viewport.height) || settings.viewport.height <= 0) errors.push('settings.viewport must have positive width and height.')
    if (typeof settings.background !== 'string' || !settings.background) errors.push('settings.background is required.')
    if (settings.gravity !== undefined && !isVector2(settings.gravity)) errors.push('settings.gravity must be a Vector2.')
  }
  const assets = value.assets
  if (!Array.isArray(assets)) errors.push('assets is required.')
  else {
    const assetIds = assets.map((asset) => isRecord(asset) && typeof asset.id === 'string' ? asset.id : '')
    if (assetIds.some((id) => !id) || !uniqueIds(assetIds)) errors.push('assets must have unique non-empty ids.')
    assets.forEach((asset, index) => { if (!isRecord(asset) || !['sprite', 'tileset', 'audio', 'font'].includes(String(asset.type)) || typeof asset.path !== 'string' || !asset.path) errors.push(`assets[${index}] must have a valid type and path.`) })
  }
  const scenes = value.scenes
  if (!Array.isArray(scenes) || scenes.length === 0) errors.push('At least one scene is required.')
  else {
    const sceneIds = scenes.map((scene) => isRecord(scene) && typeof scene.id === 'string' ? scene.id : '')
    if (sceneIds.some((id) => !id) || !uniqueIds(sceneIds)) errors.push('scenes must have unique non-empty ids.')
    if (isRecord(metadata) && typeof metadata.startingSceneId === 'string' && !sceneIds.includes(metadata.startingSceneId)) errors.push('metadata.startingSceneId must reference a scene.')
    const assetIds = Array.isArray(assets) ? assets.flatMap((asset) => isRecord(asset) && typeof asset.id === 'string' ? [asset.id] : []) : []
    scenes.forEach((scene, sceneIndex) => {
      if (!isRecord(scene) || typeof scene.name !== 'string' || !Array.isArray(scene.entities)) { errors.push(`scenes[${sceneIndex}] must have a name and entities.`); return }
      const entityIds = scene.entities.map((entity) => isRecord(entity) && typeof entity.id === 'string' ? entity.id : '')
      if (entityIds.some((id) => !id) || !uniqueIds(entityIds)) errors.push(`scenes[${sceneIndex}].entities must have unique non-empty ids.`)
      scene.entities.forEach((entity, entityIndex) => {
        if (!isRecord(entity) || !isRecord(entity.components) || !isVector2(entity.components.transform && isRecord(entity.components.transform) ? entity.components.transform.position : undefined)) errors.push(`scenes[${sceneIndex}].entities[${entityIndex}] needs components.transform.position.`)
        const sprite = isRecord(entity) && isRecord(entity.components) ? entity.components.sprite : undefined
        if (sprite !== undefined && (!isRecord(sprite) || typeof sprite.assetId !== 'string' || !assetIds.includes(sprite.assetId))) errors.push(`scenes[${sceneIndex}].entities[${entityIndex}] references an unknown sprite asset.`)
      })
    })
  }
  return errors.length ? { valid: false, errors } : { valid: true }
}
