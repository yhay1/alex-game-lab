import { createClient } from '@/lib/supabase/server'
import { ASSET_BUCKET, MAX_ASSET_BYTES, ACCEPTED_ASSET_TYPES, type GameAsset, type AssetType } from '@/lib/data/asset-types'
export { ASSET_BUCKET, MAX_ASSET_BYTES, ACCEPTED_ASSET_TYPES } from '@/lib/data/asset-types'
export type { GameAsset, AssetType } from '@/lib/data/asset-types'

export async function listAssets(projectId: string) { const supabase = await createClient(); const { data, error } = await supabase.from('game_assets').select('*').eq('project_id', projectId).order('created_at', { ascending: false }); if (error) throw error; return data as GameAsset[] }
export async function getAssetUrl(path: string) { const supabase = await createClient(); const { data, error } = await supabase.storage.from(ASSET_BUCKET).createSignedUrl(path, 3600); if (error) throw error; return data.signedUrl }
export async function deleteAsset(asset: GameAsset) { const supabase = await createClient(); const { error: storageError } = await supabase.storage.from(ASSET_BUCKET).remove([asset.storage_path]); if (storageError) throw storageError; const { error } = await supabase.from('game_assets').delete().eq('id', asset.id); if (error) throw error }
export function inferAssetType(file: File): AssetType { return file.type.startsWith('audio/') ? 'audio' : file.type === 'image/gif' ? 'sprite' : 'image' }
export function validateAsset(file: File) { if (!ACCEPTED_ASSET_TYPES.includes(file.type)) throw new Error('Use PNG, JPEG, WebP, GIF, MP3, WAV, or OGG files.'); if (file.size > MAX_ASSET_BYTES) throw new Error('Assets must be 25 MB or smaller.') }
