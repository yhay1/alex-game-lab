import { createClient } from '@/lib/supabase/server'
import { rankAssetCandidates, type AssetCandidate } from './asset-intelligence'

export async function discoverAssetCandidates(userId: string, query: string, projectId?: string): Promise<AssetCandidate[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_assets').select('id,name,kind,tags,source_type,license,project_id').eq('owner_id', userId).or(`name.ilike.%${query.replace(/[%_,]/g, '')}%,kind.ilike.%${query.replace(/[%_,]/g, '')}%`).limit(50)
  if (error) throw error
  const { data: favorites } = await supabase.from('game_asset_favorites').select('asset_id').eq('user_id', userId)
  return rankAssetCandidates(data ?? [], query, (data ?? []).filter((asset) => asset.project_id === projectId).map((asset) => asset.id), (favorites ?? []).map((favorite) => favorite.asset_id))
}
