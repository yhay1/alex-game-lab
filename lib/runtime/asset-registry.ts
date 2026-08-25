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

  async load(id: string): Promise<AssetRecord> {
    const record = this.records.get(id)
    if (!record) throw new Error(`Unknown asset: ${id}`)
    if (record.status === 'loaded' || record.status === 'error') return record
    if (record.status === 'loading') return record

    record.status = 'loading'
    if (record.definition.type !== 'sprite' || !record.definition.path) {
      record.status = 'error'
      record.error = new Error(`Asset ${id} is not loadable as an image`)
      return record
    }

    if (typeof Image === 'undefined') {
      record.status = 'error'
      record.error = new Error('Image loading is unavailable in this environment')
      return record
    }

    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = record.definition.path
    record.resource = image

    return new Promise((resolve) => {
      image.onload = () => {
        record.status = 'loaded'
        resolve(record)
      }
      image.onerror = () => {
        record.status = 'error'
        record.error = new Error(`Unable to load asset: ${id}`)
        resolve(record)
      }
    })
  }

  async loadAll(): Promise<AssetRecord[]> {
    return Promise.all([...this.records.keys()].map((id) => this.load(id)))
  }
}
