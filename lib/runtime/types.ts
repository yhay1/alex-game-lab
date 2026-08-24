export type Vec2 = { x: number; y: number }

export type RuntimeInput = {
  keys: ReadonlySet<string>
  pointer: Vec2 & { down: boolean }
  touch: { left: boolean; right: boolean; jump: boolean }
}
export type GameStatus = 'loading' | 'playing' | 'paused' | 'game-over' | 'level-complete'
export type CameraConfig = { mode?: 'fixed' | 'follow'; targetId?: string; smoothing?: number; bounds?: { x: number; y: number; width: number; height: number } }

export type SpriteFrame = { x: number; y: number; width: number; height: number }
export type AnimationClip = { frames: SpriteFrame[]; frameRate: number; loop?: boolean }
export type Renderable = {
  layer?: number
  shape?: 'rect' | 'circle' | 'line'
  sprite?: { src: string; frame?: SpriteFrame; animations?: Record<string, AnimationClip>; animation?: string }
  opacity?: number
  rotation?: number
}

export type RuntimeEntity = {
  id: string
  position: Vec2
  size: Vec2
  color: string
  kind?: 'player' | 'enemy' | 'npc' | 'item' | 'obstacle' | 'collectible'
  health?: number
  speed?: number
  damage?: number
  behavior?: 'static' | 'chase' | 'patrol'
  patrol?: { from: number; to: number; direction?: 1 | -1 }
  collectible?: { value: number; once?: boolean }
  solid?: boolean
  physics?: { velocity: Vec2; gravity: number; maxFallSpeed: number; friction: number; grounded: boolean }
  player?: { speed: number; jumpForce: number; gravity: number; groundY?: number; controls?: { left?: string[]; right?: string[]; jump?: string[] } }
  renderable?: Renderable
  update?: (entity: RuntimeEntity, context: UpdateContext) => void
  render?: (entity: RuntimeEntity, context: RenderContext) => void
}

export type RuntimeScene = { id: string; name: string; entities: RuntimeEntity[]; background?: string | { top: string; bottom: string }; camera?: CameraConfig }
export type RuntimeState = { score: number; time: number; flags: Record<string, boolean | number | string>; status: GameStatus }
export type UpdateContext = { dt: number; input: RuntimeInput; state: RuntimeState }
export type RenderContext = { ctx: CanvasRenderingContext2D; camera: { x: number; y: number; zoom: number }; assets: AssetLoader; time: number }
export type RuntimeProject = { width: number; height: number; scenes: RuntimeScene[]; startSceneId: string; state?: Partial<RuntimeState> }
export type AssetLoader = { loadImage(url: string): Promise<HTMLImageElement>; loadAudio(url: string): Promise<HTMLAudioElement>; clear(): void }
export type RuntimeHooks = { onSceneChange?: (scene: RuntimeScene) => void; onFrame?: (state: RuntimeState) => void }
