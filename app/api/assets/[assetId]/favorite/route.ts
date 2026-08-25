import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params
  const { favorite } = await request.json().catch(() => ({ favorite: false }))
  if (typeof favorite !== 'boolean') return NextResponse.json({ error: 'Favorite must be boolean' }, { status: 400 })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const result = favorite
    ? await supabase.from('game_asset_favorites').upsert({ asset_id: assetId, user_id: user.id })
    : await supabase.from('game_asset_favorites').delete().eq('asset_id', assetId).eq('user_id', user.id)
  if (result.error) return NextResponse.json({ error: 'Unable to update favorite' }, { status: 400 })
  return NextResponse.json({ favorite: Boolean(favorite) })
}
