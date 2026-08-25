export type AssetReference = {
  id: string
  name: string
  kind: string
  tags: string[]
  storagePath: string
  available: boolean
}

export type AssetMention = { query: string; token: string; start: number; end: number }

export function getActiveAssetMention(value: string, cursor: number): AssetMention | null {
  const before = value.slice(0, cursor)
  const match = before.match(/(^|\s)(@[\w./-]*)$/)
  if (!match) return null
  const token = match[2]
  return { query: token.slice(1), token, start: cursor - token.length, end: cursor }
}

export function resolveAssetReference(reference: Pick<AssetReference, 'id' | 'name'>, assets: AssetReference[]) {
  return assets.find((asset) => asset.id === reference.id) ?? { ...reference, kind: 'unknown', tags: [], storagePath: '', available: false }
}

export function insertAssetMention(value: string, mention: AssetMention, asset: AssetReference, cursor: number) {
  const replacement = `@${asset.name} `
  return { value: `${value.slice(0, mention.start)}${replacement}${value.slice(cursor)}`, cursor: mention.start + replacement.length }
}

export function rankAssetReferences(assets: AssetReference[], query: string) {
  const normalized = query.toLowerCase()
  return [...assets].sort((a, b) => {
    const score = (asset: AssetReference) => (asset.name.toLowerCase() === normalized ? 0 : asset.name.toLowerCase().startsWith(normalized) ? 1 : asset.tags.some((tag) => tag.toLowerCase().includes(normalized)) ? 2 : 3)
    return score(a) - score(b) || a.name.localeCompare(b.name)
  })
}

export function toAssetReference(asset: { id: string; name: string; kind?: string | null; tags?: string[] | null; storage_path: string }): AssetReference {
  return { id: asset.id, name: asset.name, kind: asset.kind ?? 'asset', tags: asset.tags ?? [], storagePath: asset.storage_path, available: true }
}
