'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GAME_GENRES, type GameGenre } from '@/lib/data/game-lab-types'
import { createProject } from '@/lib/data/projects-client'

export function ProjectForm() {
  const router = useRouter(); const [name, setName] = useState(''); const [genre, setGenre] = useState<GameGenre>('Platformer'); const [description, setDescription] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (!name.trim()) return setError('Give your game a name first.'); setSaving(true); setError(''); try { const project = await createProject({ name, genre, description }); router.push(`/dashboard/projects/${project.id}`); router.refresh() } catch { setError('Could not create the project. Please try again.') } finally { setSaving(false) } }
  return <form onSubmit={submit} className="flex flex-col gap-5"><label className="flex flex-col gap-2 text-sm font-medium">Project name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Neon Drift" className="h-11 rounded-xl border border-input bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><label className="flex flex-col gap-2 text-sm font-medium">Genre<select value={genre} onChange={(event) => setGenre(event.target.value as GameGenre)} className="h-11 rounded-xl border border-input bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring">{GAME_GENRES.map((item) => <option key={item}>{item}</option>)}</select></label><label className="flex flex-col gap-2 text-sm font-medium">Description<span className="font-normal text-muted-foreground">Optional</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What are you making?" rows={3} className="resize-none rounded-xl border border-input bg-background px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>{error && <p className="text-sm text-destructive" role="alert">{error}</p>}<button disabled={saving} className="h-11 rounded-xl bg-primary px-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">{saving ? 'Creating…' : 'Create project'}</button></form>
}
