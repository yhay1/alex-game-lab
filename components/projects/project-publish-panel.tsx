'use client'

import { useState } from 'react'
import { CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react'
import type { GameProject } from '@/lib/data/game-lab-types'
import type { GameProjectVersion } from '@/lib/data/game-lab'
import { validateVersionData } from '@/lib/runtime/versions'

export function ProjectPublishPanel({ project, versions }: { project: GameProject; versions: GameProjectVersion[] }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const check = validateVersionData(project.foundation)
  const latest = versions[0]
  async function publish() {
    setBusy(true); setMessage('')
    try {
      const response = await fetch(`/api/projects/${project.id}/versions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'publish' }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.errors?.join(', ') || data.error || 'Unable to publish')
      setMessage('Published successfully. Your live game uses this snapshot.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to publish.') } finally { setBusy(false) }
  }
  return <section className="flex max-w-3xl flex-col gap-4"><header className="border-b border-border pb-4"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Release control / Publish</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Ship your game</h2><p className="mt-1 text-sm text-muted-foreground">Check the draft, review the snapshot, then publish a stable build.</p></header><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-border bg-card p-4"><p className="font-mono text-[10px] uppercase text-muted-foreground">Draft check</p><p className="mt-2 flex items-center gap-2 text-sm font-medium">{check.valid ? <CheckCircle2 className="size-4 text-primary" /> : <ShieldCheck className="size-4 text-destructive" />}{check.valid ? 'Ready to publish' : 'Needs attention'}</p></div><div className="rounded-lg border border-border bg-card p-4"><p className="font-mono text-[10px] uppercase text-muted-foreground">Published</p><p className="mt-2 text-sm font-medium">{project.status === 'published' ? 'Live build active' : 'No live build'}</p></div><div className="rounded-lg border border-border bg-card p-4"><p className="font-mono text-[10px] uppercase text-muted-foreground">History</p><p className="mt-2 text-sm font-medium">{versions.length} snapshot{versions.length === 1 ? '' : 's'}</p></div></div>{!check.valid && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{check.errors.join(' ')}</div>}<div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"><div><p className="font-medium">{latest ? `Latest snapshot: ${latest.label || `Version ${latest.version_number}`}` : 'No snapshot yet'}</p><p className="mt-1 text-sm text-muted-foreground">Publishing creates an immutable version. Future edits stay in Draft.</p></div><div className="flex gap-2"><button disabled={!check.valid || busy} onClick={() => void publish()} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{busy ? 'Publishing…' : 'Publish Draft'}</button>{project.status === 'published' && <a href={`/play/${project.id}`} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium"><ExternalLink className="size-4" />Open game</a>}</div></div>{message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}</section>
}
