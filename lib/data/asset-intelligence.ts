export type AssetIntent = 'exact' | 'similar' | 'reuse' | 'generate'
export type AssetProvenance = 'owned' | 'imported' | 'external' | 'generated'
export type AssetCandidate = { id: string; name: string; kind: string; tags: string[]; source: AssetProvenance; license?: string | null; attribution?: string | null; available: boolean; score: number; reason: string }

export function detectAssetIntent(prompt: string): AssetIntent {
  const value = prompt.toLowerCase()
  if (/\b(similar|like|style|resemble)\b/.test(value)) return 'similar'
  if (/\b(generate|create|make|draw|invent)\b/.test(value)) return 'generate'
  if (/\b(reuse|use|bring back|keep)\b/.test(value)) return 'reuse'
  return 'exact'
}

export function chooseAssetPolicy(intent: AssetIntent, candidates: AssetCandidate[]) {
  const available = candidates.filter((candidate) => candidate.available)
  if (intent === 'generate') return { action: 'generate' as const, candidates: [] }
  if (available.length === 1) return { action: 'reuse' as const, candidates: available }
  if (available.length > 1) return { action: 'confirm' as const, candidates: available.slice(0, 5) }
  return { action: 'external' as const, candidates: [] }
}

export function rankAssetCandidates<T extends { id: string; name: string; kind?: string | null; tags?: string[] | null; source_type?: string | null; license?: string | null }>(assets: T[], query: string, projectAssetIds: string[] = [], favoriteIds: string[] = []) {
  const normalized = query.toLowerCase().trim()
  return assets.map((asset) => {
    const name = asset.name.toLowerCase(); const tags = (asset.tags ?? []).map((tag) => tag.toLowerCase())
    let score = 0; const reasons: string[] = []
    if (projectAssetIds.includes(asset.id)) { score += 100; reasons.push('in this project') }
    if (favoriteIds.includes(asset.id)) { score += 50; reasons.push('favorite') }
    if (name === normalized) { score += 80; reasons.push('exact name') } else if (name.includes(normalized)) { score += 35; reasons.push('name match') }
    if (tags.some((tag) => tag.includes(normalized))) { score += 25; reasons.push('tag match') }
    return { id: asset.id, name: asset.name, kind: asset.kind ?? 'asset', tags: asset.tags ?? [], source: (asset.source_type ?? 'owned') as AssetProvenance, license: asset.license, attribution: null, available: true, score, reason: reasons.join(', ') || 'library match' }
  }).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
}
