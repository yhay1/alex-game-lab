import type { AssetDefinition } from '@/lib/game-definition'

export type AssetStatus = 'idle' | 'loading' | 'loaded' | 'error'

export type AssetRecord = {
  definition: AssetDefinition
  status: AssetStatus
  resource: HTMLImageElement | null
  error: Error | null
}

export class AssetRegistry {
  private readonly records = new Map<string, AssetRecord>()

  constructor(definitions: AssetDefinition[]) {
    for (const definition of definitions) {
      this.records.set(definition.id, {
        definition,
        status: 'idle',
        resource: null,
        error: null,
      })
    }
  }

  get(id: string): AssetRecord | undefined {
    return this.records.get(id)
  }

  getStatus(id: string): AssetStatus | undefined {
    return this.records.get(id)?.status
  }

  private readonly pending = new Map<string, Promise<AssetRecord>>()

  load(id: string): Promise<AssetRecord> {
    const record = this.records.get(id)
    if (!record) throw new Error(`Unknown asset: ${id}`)
    if (record.status === 'loaded' || record.status === 'error') return Promise.resolve(record)
    const pending = this.pending.get(id)
    if (pending) return pending

    record.status = 'loading'
    const promise = new Promise<AssetRecord>((resolve) => {
      if (record.definition.type !== 'sprite' || !record.definition.path) {
        record.status = 'error'
        record.error = new Error(`Asset ${id} is not loadable as an image`)
        resolve(record)
        return
      }
      if (typeof Image === 'undefined') {
        record.status = 'error'
        record.error = new Error('Image loading is unavailable in this environment')
        resolve(record)
        return
      }
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => { record.status = 'loaded'; resolve(record) }
      image.onerror = () => { record.status = 'error'; record.error = new Error(`Unable to load asset: ${id}`); resolve(record) }
      record.resource = image
      image.src = record.definition.path
    })
    this.pending.set(id, promise)
    return promise
  }

  async loadAll(): Promise<AssetRecord[]> {
    return Promise.all([...this.records.keys()].map((id) => this.load(id)))
  }

  clear(): void {
    this.pending.clear()
    this.records.clear()
  }
}
