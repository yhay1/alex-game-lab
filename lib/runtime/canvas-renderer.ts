import type { GameDefinition } from '@/lib/game-definition'
import type { GameRuntime, RuntimeEntity } from '@/lib/game-runtime'
import { AssetRegistry } from './asset-registry'

export type CanvasRenderOptions = {
  background?: string
  clear?: boolean
}

export class CanvasRenderer {
  private readonly ctx: CanvasRenderingContext2D
  private readonly definition: GameDefinition
  private readonly options: Required<CanvasRenderOptions>
  private readonly assets: AssetRegistry

  constructor(private readonly canvas: HTMLCanvasElement, definition: GameDefinition, options: CanvasRenderOptions = {}) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2D canvas rendering is unavailable')
    this.ctx = ctx
    this.definition = definition
    this.assets = new AssetRegistry(definition.assets)
    void this.assets.loadAll()
    this.options = { background: options.background ?? '#10141d', clear: options.clear ?? true }
    this.ctx.imageSmoothingEnabled = false
  }

  render(runtime: GameRuntime): void {
    const { ctx, canvas } = this
    const viewport = this.definition.settings.viewport
    const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height)
    const offsetX = (canvas.width - viewport.width * scale) / 2
    const offsetY = (canvas.height - viewport.height * scale) / 2
    if (this.options.clear) {
      ctx.fillStyle = this.options.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.save()
    ctx.translate(offsetX, offsetY)
    ctx.scale(scale, scale)
    const scene = runtime.getActiveScene()
    for (const entity of scene.getEntities()) this.renderEntity(entity)
    ctx.restore()
  }

  private renderEntity(entity: RuntimeEntity): void {
    const transform = entity.components.transform
    const sprite = entity.components.sprite
    if (!transform || !sprite) return
    const record = this.assets.get(sprite.assetId)
    const image = record?.status === 'loaded' ? record.resource : null
    const x = transform.position.x
    const y = transform.position.y
    const width = 32 * (transform.scale?.x ?? 1)
    const height = 32 * (transform.scale?.y ?? 1)
    this.ctx.fillStyle = entity.id === 'player' ? '#f3b562' : '#61758f'
    this.ctx.fillRect(x, y, width, height)
    if (image) {
      this.ctx.drawImage(image, x, y, width, height)
    }
  }
}
