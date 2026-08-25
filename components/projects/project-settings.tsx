'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Sparkles } from 'lucide-react'
import { GAME_GENRES, type GameGenre, type GameProject } from '@/lib/data/game-lab-types'
import { createClient } from '@/lib/supabase/client'
import { updateProject } from '@/lib/data/projects-client'
import { ASSET_BUCKET } from '@/lib/data/asset-types'

export function ProjectSettings({ project }: { project: GameProject }) {
  const router = useRouter()
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description ?? '')
  const [genre, setGenre] = useState<GameGenre>(project.genre ?? 'Platformer')
  const [cover, setCover] = useState(project.cover_image_url ?? '')
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setStatus('')
    try { await updateProject(project.id, { name: name.trim(), description: description.trim(), genre, cover_image_url: cover.trim() || null }); setStatus('Project settings saved.'); router.refresh() } catch { setStatus('Could not save settings.') } finally { setSaving(false) }
  }
  async function upload(file: File) {
    if (!file.type.startsWith('image/')) return setStatus('Choose an image file for the cover.')
    if (file.size > 10 * 1024 * 1024) return setStatus('Cover images must be 10 MB or smaller.')
    setUploading(true); setStatus('')
    try { const supabase = createClient(); const path = `${project.owner_id}/covers/${project.id}-${crypto.randomUUID()}.${file.name.split('.').pop() ?? 'png'}`; const { error } = await supabase.storage.from(ASSET_BUCKET).upload(path, file, { upsert: false, contentType: file.type }); if (error) throw error; await updateProject(project.id, { cover_image_url: path }); setCover(path); setStatus('Cover uploaded and saved.'); router.refresh() } catch { setStatus('Could not upload the cover image.') } finally { setUploading(false) }
  }
  return <section className="rounded-3xl border border-border bg-card p-6 md:p-8"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Project settings</p><h2 className="mt-2 text-2xl font-semibold">Shape the project identity</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">These settings are private to your project until you publish it.</p></div><ImagePlus className="size-5 text-primary" /></div><form onSubmit={save} className="mt-8 grid gap-5"><label className="grid gap-2 text-sm font-medium">Project name<input required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl border border-input bg-background px-3" /></label><label className="grid gap-2 text-sm font-medium">Genre / category<select value={genre} onChange={(e) => setGenre(e.target.value as GameGenre)} className="h-11 rounded-xl border border-input bg-background px-3">{GAME_GENRES.map((item) => <option key={item}>{item}</option>)}</select></label><label className="grid gap-2 text-sm font-medium">Description<textarea maxLength={500} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none rounded-xl border border-input bg-background px-3 py-3" /></label><div className="grid gap-3"><span className="text-sm font-medium">Cover image</span>{cover ? <div className="rounded-2xl border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">Cover asset saved: <span className="font-mono text-xs">{cover.split('/').pop()}</span></div> : <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">No cover image yet. Upload one or wait for AI cover generation.</div>}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file) }} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground" /></div><div className="rounded-2xl border border-primary/25 bg-primary/5 p-4"><div className="flex items-center gap-2 font-medium"><Sparkles className="size-4 text-primary" />Generate cover with AI</div><p className="mt-2 text-sm leading-6 text-muted-foreground">AI image generation is not connected yet. Your prompt will be ready for the future generator, but no image will be falsely created.</p><input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. neon rooftop arena at dusk" className="mt-3 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm" /><button type="button" disabled={!prompt.trim()} onClick={() => setStatus('AI cover generation is Coming Soon. Your prompt is ready to use when it is connected.')} className="mt-3 rounded-xl border border-border px-3 py-2 text-sm font-medium disabled:opacity-50">Save prompt for later</button></div>{status && <p role="status" className="text-sm text-muted-foreground">{status}</p>}<button disabled={saving || uploading} className="h-11 rounded-xl bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60">{saving ? 'Saving…' : 'Save project settings'}</button></form></section>
}
