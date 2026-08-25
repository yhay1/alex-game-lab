import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { ACCEPTED_ASSET_TYPES, ASSET_BUCKET, MAX_ASSET_BYTES } from '@/lib/data/assets'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await request.formData()
  const file = form.get('file')
  const name = String(form.get('name') || '')
  const tags = String(form.get('tags') || '').split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean).slice(0, 12)
  if (!(file instanceof File) || !name.trim()) return NextResponse.json({ error: 'A file and name are required' }, { status: 400 })
  if (!ACCEPTED_ASSET_TYPES.includes(file.type) || file.size > MAX_ASSET_BYTES) return NextResponse.json({ error: 'Unsupported file type or size' }, { status: 400 })

  const id = randomUUID()
  const path = `${user.id}/${id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120)}`
  const upload = await supabase.storage.from(ASSET_BUCKET).upload(path, file, { contentType: file.type, upsert: false })
  if (upload.error) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

  const kind = file.type.startsWith('audio/') ? 'audio' : file.type === 'image/gif' ? 'sprite' : 'image'
  const inserted = await supabase.from('game_assets').insert({ id, owner_id: user.id, project_id: null, name: name.trim().slice(0, 120), description: null, asset_type: kind, kind, storage_path: path, mime_type: file.type, size_bytes: file.size, source_type: 'upload', visibility: 'private', tags, classification_status: 'classified', metadata: { original_name: file.name, classifier: 'deterministic-mime-fallback', dimensions: null } }).select('id').single()
  if (inserted.error) {
    await supabase.storage.from(ASSET_BUCKET).remove([path])
    return NextResponse.json({ error: 'Could not register asset' }, { status: 500 })
  }
  return NextResponse.json({ id }, { status: 201 })
}
