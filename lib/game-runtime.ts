import { validateGameDefinition, type EntityDefinition, type GameDefinition, type SceneDefinition } from './game-definition'

export type RuntimeEntity = EntityDefinition & { state: Record<string, unknown> }

function clone<T>(value: T): T {
  return structuredClone(value)
}

export class RuntimeScene {
  readonly id: string
  readonly name: string
  private readonly entities = new Map<string, RuntimeEntity>()

  constructor(definition: SceneDefinition) {
    this.id = definition.id
    this.name = definition.name
    for (const entity of definition.entities) {
      this.entities.set(entity.id, { ...clone(entity), state: {} })
    }
  }

  getEntities(): RuntimeEntity[] { return [...this.entities.values()].map(clone) }
  getEntity(id: string): RuntimeEntity | undefined { const entity = this.entities.get(id); return entity ? clone(entity) : undefined }
  createEntity(entity: EntityDefinition): RuntimeEntity { if (this.entities.has(entity.id)) throw new Error(`Entity already exists: ${entity.id}`); const runtime = { ...clone(entity), state: {} }; this.entities.set(entity.id, runtime); return clone(runtime) }
  updateEntityState(id: string, state: Record<string, unknown>): RuntimeEntity { const entity = this.entities.get(id); if (!entity) throw new Error(`Unknown entity: ${id}`); entity.state = { ...entity.state, ...clone(state) }; return clone(entity) }
  destroyEntity(id: string): boolean { return this.entities.delete(id) }
}

export class GameRuntime {
  readonly definition: GameDefinition
  private readonly scenes = new Map<string, RuntimeScene>()
  private activeSceneId: string
  private started = false

  constructor(definition: GameDefinition) {
    const result = validateGameDefinition(definition)
    if (!result.valid) throw new Error(`Invalid game definition: ${result.errors.join('; ')}`)
    this.definition = clone(definition)
    for (const scene of definition.scenes) this.scenes.set(scene.id, new RuntimeScene(scene))
    this.activeSceneId = definition.metadata.startingSceneId
  }

  initialize(): void { this.started = true }
  update(deltaSeconds: number): void { if (!this.started) throw new Error('Game runtime is not initialized'); void deltaSeconds }
  destroy(): void { this.started = false }
  isInitialized(): boolean { return this.started }
  getActiveScene(): RuntimeScene { const scene = this.scenes.get(this.activeSceneId); if (!scene) throw new Error(`Unknown active scene: ${this.activeSceneId}`); return scene }
  switchScene(sceneId: string): RuntimeScene { if (!this.scenes.has(sceneId)) throw new Error(`Unknown scene: ${sceneId}`); this.activeSceneId = sceneId; return this.getActiveScene() }
  getActiveSceneId(): string { return this.activeSceneId }
}
