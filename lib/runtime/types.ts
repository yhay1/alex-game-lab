export type Vec2 = { x: number; y: number }

export type RuntimeInput = {
  keys: ReadonlySet<string>
  pointer: Vec2 & { down: boolean }
}

export type RuntimeEntity = {
  id: string
  position: Vec2
  size: Vec2
  color: string
  solid?: boolean
  update?: (entity: RuntimeEntity, context: UpdateContext) => void
  render?: (entity: RuntimeEntity, context: RenderContext) => void
}

export type RuntimeScene = { id: string; name: string; entities: RuntimeEntity[]; background?: string }
export type RuntimeState = { score: number; time: number; flags: Record<string, boolean | number | string> }
export type UpdateContext = { dt: number; input: RuntimeInput; state: RuntimeState }
export type RenderContext = { ctx: CanvasRenderingContext2D; camera: { x: number; y: number; zoom: number } }
export type RuntimeProject = { width: number; height: number; scenes: RuntimeScene[]; startSceneId: string; state?: Partial<RuntimeState> }
export type AssetLoader = { loadImage(url: string): Promise<HTMLImageElement>; loadAudio(url: string): Promise<HTMLAudioElement>; clear(): void }
export type RuntimeHooks = { onSceneChange?: (scene: RuntimeScene) => void; onFrame?: (state: RuntimeState) => void }
