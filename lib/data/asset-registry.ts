import { createClient } from '@/lib/supabase/server'

export type RegistryAsset = {
  id: string
  name: string
  kind: string
  storage_path: string
  project_id: string | null
  owner_id: string
  visibility: 'public' | 'private'
  source_type: 'upload' | 'generated' | 'imported'
  source_url: string | null
  license: string | null
  tags: string[]
  classification_status: 'unclassified' | 'pending' | 'classified'
  metadata: Record<string, unknown> | null
  created_at: string
}

export async function listRegistryAssets(filters?: { query?: string; kind?: string; publicOnly?: boolean }) {
  const supabase = await createClient()
  let query = supabase.from('game_assets').select('*').order('created_at', { ascending: false }).limit(100)
  if (filters?.kind && filters.kind !== 'all') query = query.eq('kind', filters.kind)
  if (filters?.publicOnly) query = query.eq('visibility', 'public')
  else {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')
    query = query.eq('owner_id', user.id)
  }
  if (filters?.query) query = query.ilike('name', `%${filters.query}%`)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as RegistryAsset[]
}

export async function toggleAssetFavorite(assetId: string, userId: string, favorite: boolean) {
  const supabase = await createClient()
  if (favorite) {
    const { error } = await supabase.from('game_asset_favorites').upsert({ asset_id: assetId, user_id: userId })
    if (error) throw error
  } else {
    const { error } = await supabase.from('game_asset_favorites').delete().eq('asset_id', assetId).eq('user_id', userId)
    if (error) throw error
  }
}

export async function reportAsset(assetId: string, reporterId: string, reason: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('game_asset_reports').insert({ asset_id: assetId, reporter_id: reporterId, reason: reason.slice(0, 500) })
  if (error) throw error
}

export async function getAssetDownloadUrl(path: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from('game-assets').createSignedUrl(path, 3600)
  if (error) throw error
  return data.signedUrl
}
