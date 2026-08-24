import type { AssetLoader, CameraConfig, RuntimeInput, RuntimeProject, RuntimeScene, RuntimeState, Vec2 } from './types'
import { CanvasRenderer } from './renderer'
import { updatePlayer } from './player'
import { simulatePhysics } from './physics'
import { applyContactDamage, updateEntities } from './entities'

export class Camera {
  x = 0
  y = 0
  zoom = 1
  constructor(public width: number, public height: number) {}
  follow(target: Vec2, config: CameraConfig = {}) { if (config.mode === 'fixed') return; const desiredX = target.x - this.width / 2 / this.zoom; const desiredY = target.y - this.height / 2 / this.zoom; const smoothing = Math.min(Math.max(config.smoothing ?? 1, 0.01), 1); this.x += (desiredX - this.x) * smoothing; this.y += (desiredY - this.y) * smoothing; this.clamp(config.bounds) }
  setFixed(position: Vec2, bounds?: CameraConfig['bounds']) { this.x = position.x; this.y = position.y; this.clamp(bounds) }
  private clamp(bounds?: CameraConfig['bounds']) { if (!bounds) return; this.x = Math.min(Math.max(this.x, bounds.x), Math.max(bounds.x, bounds.x + bounds.width - this.width / this.zoom)); this.y = Math.min(Math.max(this.y, bounds.y), Math.max(bounds.y, bounds.y + bounds.height - this.height / this.zoom)) }
  worldToScreen(point: Vec2) { return { x: (point.x - this.x) * this.zoom, y: (point.y - this.y) * this.zoom } }
}

export class SceneManager {
  current: RuntimeScene
  get all() { return this.scenes }
  private readonly initial: RuntimeScene[]
  constructor(private scenes: RuntimeScene[], startId: string) { this.initial = structuredClone(scenes); this.current = scenes.find((scene) => scene.id === startId) ?? scenes[0] }
  switchTo(id: string) { const next = this.scenes.find((scene) => scene.id === id); if (next) this.current = next; return this.current }
  load(id: string) { return this.switchTo(id) }
  next() { const index = this.all.findIndex((scene) => scene.id === this.current.id); const next = this.all[index + 1]; return next ? this.switchTo(next.id) : undefined }
  resetCurrent() { const index = this.scenes.findIndex((scene) => scene.id === this.current.id); if (index >= 0) this.scenes[index] = structuredClone(this.initial[index]); this.current = this.scenes[index]; return this.current }
  spawn(tag?: string) { const point = this.current.spawnPoints?.find((spawn) => !tag || spawn.tags?.includes(tag)) ?? this.current.spawnPoints?.[0]; return point ? { ...point.position } : undefined }
}

export class Input {
  keys = new Set<string>()
  pointer = { x: 0, y: 0, down: false }
  touch = { left: false, right: false, jump: false }
  attach(canvas: HTMLCanvasElement) {
    const touchStart = (event: Event) => { const control = (event as CustomEvent<{ control: 'left' | 'right' | 'jump' }>).detail.control; this.touch[control] = true }
    const touchEnd = (event: Event) => { const control = (event as CustomEvent<{ control: 'left' | 'right' | 'jump' }>).detail.control; this.touch[control] = false }
    window.addEventListener('runtime-touch-start', touchStart as EventListener); window.addEventListener('runtime-touch-end', touchEnd as EventListener)
    const keyDown = (event: KeyboardEvent) => this.keys.add(event.key)
    const keyUp = (event: KeyboardEvent) => this.keys.delete(event.key)
    const pointer = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); this.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, down: event.buttons > 0 } }
    window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp)
    canvas.addEventListener('pointermove', pointer); canvas.addEventListener('pointerdown', pointer); canvas.addEventListener('pointerup', pointer)
    return () => { window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); canvas.removeEventListener('pointermove', pointer); canvas.removeEventListener('pointerdown', pointer); canvas.removeEventListener('pointerup', pointer); window.removeEventListener('runtime-touch-start', touchStart as EventListener); window.removeEventListener('runtime-touch-end', touchEnd as EventListener) }
  }
  snapshot(): RuntimeInput { return { keys: new Set(this.keys), pointer: { ...this.pointer }, touch: { ...this.touch } } }
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
  private readonly detachInput: () => void
  readonly scenes: SceneManager
  readonly state: RuntimeState
  private readonly renderer: CanvasRenderer
  constructor(private canvas: HTMLCanvasElement, project: RuntimeProject, private onFrame?: (state: RuntimeState) => void) {
    this.camera = new Camera(project.width, project.height); this.detachInput = this.input.attach(canvas); this.scenes = new SceneManager(project.scenes, project.startSceneId); this.state = { score: 0, time: 0, flags: {}, status: 'loading', levelId: project.startSceneId, levelComplete: false, ...project.state }; this.renderer = new CanvasRenderer(canvas, project.width, project.height); this.applySpawn()
  }
  private applySpawn() { const player = this.scenes.current.entities.find((entity) => entity.kind === 'player' || Boolean(entity.player)); const spawn = this.scenes.spawn('player'); if (player && spawn) player.position = spawn }
  switchLevel(id: string) { const scene = this.scenes.load(id); if (!scene) return false; this.applySpawn(); this.state.levelId = scene.id; this.state.levelComplete = false; this.state.status = 'playing'; this.onFrame?.(this.state); this.start(); return true }
  nextLevel() { const scene = this.scenes.next(); if (!scene) return false; this.applySpawn(); this.state.levelId = scene.id; this.state.levelComplete = false; this.state.status = 'playing'; this.onFrame?.(this.state); this.start(); return true }
  start() { if (this.running) return; this.state.status = 'playing'; this.running = true; this.last = performance.now(); this.frame = requestAnimationFrame(this.tick) }
  stop() { this.running = false; cancelAnimationFrame(this.frame) }
  destroy() { this.stop(); this.detachInput(); this.assets.clear() }
  pause() { this.state.status = 'paused'; this.stop() }
  reset() { this.scenes.resetCurrent(); this.applySpawn(); this.state.score = 0; this.state.time = 0; this.state.flags = {}; this.state.levelId = this.scenes.current.id; this.state.levelComplete = false; this.state.status = 'loading'; this.start() }
  setStatus(status: RuntimeState['status']) { this.state.status = status; if (status === 'playing') this.start(); else if (status !== 'loading') this.stop() }
  private tick = (now: number) => { if (!this.running) return; const dt = Math.min((now - this.last) / 1000, 0.05); this.last = now; this.update(dt); this.render(); this.frame = requestAnimationFrame(this.tick) }
  private update(dt: number) { this.state.time += dt; const input = this.input.snapshot(); const entities = this.scenes.current.entities
    const cameraConfig = this.scenes.current.camera
    const cameraTarget = entities.find((entity) => entity.id === (cameraConfig?.targetId ?? 'player'))
    if (cameraConfig?.mode === 'fixed') this.camera.setFixed(cameraConfig.bounds ? { x: cameraConfig.bounds.x, y: cameraConfig.bounds.y } : { x: 0, y: 0 }, cameraConfig.bounds)
    else if (cameraTarget) this.camera.follow(cameraTarget.position, cameraConfig)
    const bounds = this.scenes.current.bounds
    for (const entity of entities) { if (!bounds || entity.kind === 'obstacle') continue; entity.position.x = Math.min(Math.max(entity.position.x, bounds.x), bounds.x + bounds.width - entity.size.x); entity.position.y = Math.min(Math.max(entity.position.y, bounds.y), bounds.y + bounds.height - entity.size.y) }
    const platforms = entities.filter((entity) => entity.solid)
    for (const entity of entities) { if (entity.player) updatePlayer(entity, input, dt, platforms) }
    updateEntities(entities, input, this.state, dt)
    simulatePhysics(entities.filter((entity) => !entity.player), dt); applyContactDamage(entities, this.state)
    if (bounds) for (const entity of entities) { if (entity.kind === 'obstacle') continue; entity.position.x = Math.min(Math.max(entity.position.x, bounds.x), bounds.x + bounds.width - entity.size.x); entity.position.y = Math.min(Math.max(entity.position.y, bounds.y), bounds.y + bounds.height - entity.size.y) }
    const player = entities.find((entity) => entity.kind === 'player' || Boolean(entity.player))
    if (player && (player.health ?? 1) <= 0) this.state.status = 'game-over'
    const completion = this.scenes.current.completion
    if (completion && ((completion.score !== undefined && this.state.score >= completion.score) || (completion.flag !== undefined && this.state.flags[completion.flag] === true))) { this.state.levelComplete = true; this.state.status = 'level-complete' }
    if (this.state.status !== 'playing') this.stop()
    this.onFrame?.(this.state) }
  private render() { const scene = this.scenes.current; this.renderer.render(scene, this.camera, this.assets, this.state.time); for (const entity of scene.entities) entity.render?.(entity, { ctx: this.canvas.getContext('2d')!, camera: this.camera, assets: this.assets, time: this.state.time }) }
}
