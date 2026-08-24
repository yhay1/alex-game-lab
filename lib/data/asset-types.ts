export type AssetType = 'image' | 'sprite' | 'audio'
export type GameAsset = { id: string; project_id: string; owner_id: string; name: string; description: string | null; asset_type: AssetType; storage_path: string; mime_type: string; size_bytes: number; width: number | null; height: number | null; duration_seconds: number | null; created_at: string; updated_at: string }
export const ASSET_BUCKET = 'game-assets'
export const MAX_ASSET_BYTES = 25 * 1024 * 1024
export const ACCEPTED_ASSET_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'audio/mpeg', 'audio/wav', 'audio/ogg']
