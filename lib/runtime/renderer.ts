import type { AssetLoader, RuntimeEntity, RuntimeScene } from './types'

export class CanvasRenderer {
  private animationTimes = new Map<string, number>()
  constructor(private canvas: HTMLCanvasElement, private width: number, private height: number) { this.resize() }
  resize() { const dpr = Math.min(window.devicePixelRatio || 1, 2); this.canvas.width = this.width * dpr; this.canvas.height = this.height * dpr; this.canvas.style.aspectRatio = `${this.width} / ${this.height}`; const ctx = this.canvas.getContext('2d'); ctx?.setTransform(dpr, 0, 0, dpr, 0, 0) }
  render(scene: RuntimeScene, camera: { x: number; y: number; zoom: number }, assets: AssetLoader, time: number) {
    const ctx = this.canvas.getContext('2d'); if (!ctx) return
    ctx.save(); ctx.setTransform(this.canvas.width / this.width, 0, 0, this.canvas.height / this.height, 0, 0)
    const background = scene.background
    if (typeof background === 'object') { const gradient = ctx.createLinearGradient(0, 0, 0, this.height); gradient.addColorStop(0, background.top); gradient.addColorStop(1, background.bottom); ctx.fillStyle = gradient } else ctx.fillStyle = background ?? '#101522'
    ctx.fillRect(0, 0, this.width, this.height)
    for (const entity of [...scene.entities].sort((a, b) => (a.renderable?.layer ?? 0) - (b.renderable?.layer ?? 0))) this.drawEntity(ctx, entity, camera, assets, time)
    ctx.restore()
  }
  private drawEntity(ctx: CanvasRenderingContext2D, entity: RuntimeEntity, camera: { x: number; y: number; zoom: number }, assets: AssetLoader, time: number) {
    const point = { x: (entity.position.x - camera.x) * camera.zoom, y: (entity.position.y - camera.y) * camera.zoom }; const width = entity.size.x * camera.zoom; const height = entity.size.y * camera.zoom; const renderable = entity.renderable ?? {}
    ctx.save(); ctx.globalAlpha = renderable.opacity ?? 1; ctx.translate(point.x + width / 2, point.y + height / 2); ctx.rotate(renderable.rotation ?? 0)
    if (renderable.sprite) { const clip = renderable.sprite.animation ? renderable.sprite.animations?.[renderable.sprite.animation] : undefined; const frame = clip ? clip.frames[Math.floor((time * clip.frameRate) % clip.frames.length)] : renderable.sprite.frame; const imagePromise = assets.loadImage(renderable.sprite.src); imagePromise.then((image) => { if (!ctx) return; ctx.save(); ctx.globalAlpha = renderable.opacity ?? 1; ctx.translate(point.x + width / 2, point.y + height / 2); if (frame) ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, -width / 2, -height / 2, width, height); else ctx.drawImage(image, -width / 2, -height / 2, width, height); ctx.restore() }).catch(() => undefined) }
    else { ctx.fillStyle = entity.color; if (renderable.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, Math.min(width, height) / 2, 0, Math.PI * 2); ctx.fill() } else if (renderable.shape === 'line') { ctx.strokeStyle = entity.color; ctx.lineWidth = Math.max(1, height); ctx.beginPath(); ctx.moveTo(-width / 2, 0); ctx.lineTo(width / 2, 0); ctx.stroke() } else ctx.fillRect(-width / 2, -height / 2, width, height) }
    ctx.restore()
  }
}
