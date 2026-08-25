'use client'

import { useState } from 'react'

export function AssetImportForm() {
  const [name, setName] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!file) return setStatus('Choose a file first.')
    const body = new FormData(); body.set('file', file); body.set('name', name); body.set('tags', tags)
    setStatus('Uploading…')
    const response = await fetch('/api/assets/import', { method: 'POST', body })
    setStatus(response.ok ? 'Imported. Refresh to see it in the registry.' : 'Import failed. Check the file type and size.')
    if (response.ok) { setName(''); setTags(''); setFile(null) }
  }
  return <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-end"><label className="flex-1 text-sm"><span className="mb-1 block text-muted-foreground">Asset name</span><input required value={name} onChange={(event) => setName(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3" /></label><label className="flex-1 text-sm"><span className="mb-1 block text-muted-foreground">Tags</span><input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="player, ui, forest" className="h-10 w-full rounded-lg border border-border bg-background px-3" /></label><label className="flex-1 text-sm"><span className="mb-1 block text-muted-foreground">File</span><input required type="file" accept="image/png,image/jpeg,image/webp,image/gif,audio/mpeg,audio/wav,audio/ogg" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block h-10 w-full pt-2 text-xs" /></label><button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">Import</button>{status && <p aria-live="polite" className="text-xs text-muted-foreground md:max-w-40">{status}</p>}</form>
}
