import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ASSET_BUCKET, ACCEPTED_ASSET_TYPES, MAX_ASSET_BYTES, inferAssetType } from '@/lib/data/assets'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const project = await supabase.from('game_projects').select('id').eq('id', id).eq('owner_id', user.id).single(); if (project.error) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  const form = await request.formData(); const file = form.get('file'); if (!(file instanceof File)) return NextResponse.json({ error: 'File is required' }, { status: 400 }); if (!ACCEPTED_ASSET_TYPES.includes(file.type) || file.size > MAX_ASSET_BYTES) return NextResponse.json({ error: 'Unsupported file or file is too large' }, { status: 400 })
  const assetId = crypto.randomUUID(); const path = `${user.id}/${id}/${assetId}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`; const upload = await supabase.storage.from(ASSET_BUCKET).upload(path, file, { contentType: file.type, upsert: false }); if (upload.error) return NextResponse.json({ error: upload.error.message }, { status: 500 })
  const { data, error } = await supabase.from('game_assets').insert({ id: assetId, project_id: id, owner_id: user.id, name: String(form.get('name') || file.name), description: String(form.get('description') || '') || null, asset_type: inferAssetType(file), storage_path: path, mime_type: file.type, size_bytes: file.size }).select('*').single(); if (error) { await supabase.storage.from(ASSET_BUCKET).remove([path]); return NextResponse.json({ error: error.message }, { status: 500 }) }; return NextResponse.json(data)
}
