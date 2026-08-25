import { createClient } from '@/lib/supabase/server'
import { toAssetReference, type AssetReference } from './asset-references'

export async function listUserAssetReferences(userId: string, query?: string): Promise<AssetReference[]> {
  const supabase = await createClient()
  let request = supabase.from('game_assets').select('id,name,kind,tags,storage_path').eq('owner_id', userId).order('created_at', { ascending: false }).limit(50)
  if (query) request = request.ilike('name', `%${query.replace(/[%_]/g, '')}%`)
  const { data, error } = await request
  if (error) throw error
  return (data ?? []).map(toAssetReference)
}

export async function resolveUserAssetReferences(userId: string, ids: string[]) {
  if (!ids.length) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_assets').select('id,name,kind,tags,storage_path').eq('owner_id', userId).in('id', ids)
  if (error) throw error
  const found = new Map((data ?? []).map((asset) => [asset.id, toAssetReference(asset)]))
  return ids.map((id) => found.get(id) ?? { id, name: 'Unavailable asset', kind: 'unknown', tags: [], storagePath: '', available: false })
}
