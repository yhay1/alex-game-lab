import type { AssetLoader, RuntimeInput, RuntimeProject, RuntimeScene, RuntimeState, Vec2 } from './types'

export class Camera {
  x = 0
  y = 0
  zoom = 1
  constructor(public width: number, public height: number) {}
  follow(target: Vec2) { this.x = target.x - this.width / 2 / this.zoom; this.y = target.y - this.height / 2 / this.zoom }
  worldToScreen(point: Vec2) { return { x: (point.x - this.x) * this.zoom, y: (point.y - this.y) * this.zoom } }
}

export class SceneManager {
  current: RuntimeScene
  constructor(private scenes: RuntimeScene[], startId: string) { this.current = scenes.find((scene) => scene.id === startId) ?? scenes[0] }
  switchTo(id: string) { const next = this.scenes.find((scene) => scene.id === id); if (next) this.current = next }
}

export class Input {
  keys = new Set<string>()
  pointer = { x: 0, y: 0, down: false }
  attach(canvas: HTMLCanvasElement) {
    const keyDown = (event: KeyboardEvent) => this.keys.add(event.key)
    const keyUp = (event: KeyboardEvent) => this.keys.delete(event.key)
    const pointer = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); this.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, down: event.buttons > 0 } }
    window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp)
    canvas.addEventListener('pointermove', pointer); canvas.addEventListener('pointerdown', pointer); canvas.addEventListener('pointerup', pointer)
    return () => { window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); canvas.removeEventListener('pointermove', pointer); canvas.removeEventListener('pointerdown', pointer); canvas.removeEventListener('pointerup', pointer) }
  }
  snapshot(): RuntimeInput { return { keys: new Set(this.keys), pointer: { ...this.pointer } } }
}

export class Assets implements AssetLoader {
  private images = new Map<string, Promise<HTMLImageElement>>()
  private audio = new Map<string, Promise<HTMLAudioElement>>()
  loadImage(url: string) { if (!this.images.has(url)) this.images.set(url, new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = url })); return this.images.get(url)! }
  loadAudio(url: string) { if (!this.audio.has(url)) this.audio.set(url, Promise.resolve(new Audio(url))); return this.audio.get(url)! }
  clear() { this.images.clear(); this.audio.clear() }
}

export class Runtime {
  private frame = 0
  private last = 0
  private running = false
  readonly camera: Camera
  readonly input = new Input()
  readonly assets = new Assets()
  readonly scenes: SceneManager
  readonly state: RuntimeState
  constructor(private canvas: HTMLCanvasElement, project: RuntimeProject, private onFrame?: (state: RuntimeState) => void) {
    this.camera = new Camera(project.width, project.height); this.scenes = new SceneManager(project.scenes, project.startSceneId); this.state = { score: 0, time: 0, flags: {}, ...project.state }; canvas.width = project.width; canvas.height = project.height
  }
  start() { if (this.running) return; this.running = true; this.last = performance.now(); this.frame = requestAnimationFrame(this.tick) }
  stop() { this.running = false; cancelAnimationFrame(this.frame) }
  reset() { this.state.score = 0; this.state.time = 0; this.state.flags = {} }
  private tick = (now: number) => { if (!this.running) return; const dt = Math.min((now - this.last) / 1000, 0.05); this.last = now; this.update(dt); this.render(); this.frame = requestAnimationFrame(this.tick) }
  private update(dt: number) { this.state.time += dt; const input = this.input.snapshot(); for (const entity of this.scenes.current.entities) { entity.update?.(entity, { dt, input, state: this.state }); if (entity.id === 'player') { const speed = 220 * dt; if (input.keys.has('ArrowLeft') || input.keys.has('a')) entity.position.x -= speed; if (input.keys.has('ArrowRight') || input.keys.has('d')) entity.position.x += speed; if (input.keys.has('ArrowUp') || input.keys.has('w')) entity.position.y -= speed; if (input.keys.has('ArrowDown') || input.keys.has('s')) entity.position.y += speed } } this.onFrame?.(this.state) }
  private render() { const ctx = this.canvas.getContext('2d'); if (!ctx) return; const scene = this.scenes.current; ctx.fillStyle = scene.background ?? '#101522'; ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); for (const entity of scene.entities) { const point = this.camera.worldToScreen(entity.position); ctx.fillStyle = entity.color; ctx.fillRect(point.x, point.y, entity.size.x * this.camera.zoom, entity.size.y * this.camera.zoom); entity.render?.(entity, { ctx, camera: this.camera }) } }
}
