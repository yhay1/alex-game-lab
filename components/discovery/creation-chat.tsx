'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUp, Bot, Check, Loader2, Sparkles, UserRound } from 'lucide-react'
import { createProject } from '@/lib/data/projects-client'
import { type GameGenre } from '@/lib/data/game-lab-types'

type Message = { role: 'assistant' | 'user'; content: string }

function inferProject(prompt: string) {
  const normalized = prompt.toLowerCase()
  const genre: GameGenre = normalized.includes('race') || normalized.includes('racing') ? 'Racing' : normalized.includes('fight') || normalized.includes('combat') ? 'Fighting' : normalized.includes('puzzle') ? 'Puzzle' : normalized.includes('surviv') ? 'Survival' : normalized.includes('strategy') ? 'Strategy' : 'Platformer'
  const cleaned = prompt.replace(/^(generate|make|create|build)\s+(a|an|the)?\s*/i, '').trim()
  const name = cleaned.split(/\s+/).slice(0, 6).map((word) => word ? word[0].toUpperCase() + word.slice(1) : word).join(' ') || 'Untitled Game'
  return { name: name.replace(/[.!?]+$/, ''), genre }
}

export function CreationChat() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Tell me what you want to make. I’ll turn your idea into a private project brief to start the workspace.' }])
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState<{ name: string; genre: GameGenre } | null>(null)
  const canSend = prompt.trim().length > 0 && !saving
  const suggestions = useMemo(() => ['A neon rooftop platformer', 'A cozy space survival game', 'A tactical puzzle adventure'], [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!canSend) return
    const request = prompt.trim()
    const inferred = inferProject(request)
    setMessages((current) => [...current, { role: 'user', content: request }, { role: 'assistant', content: `I’ve shaped that into “${inferred.name},” a ${inferred.genre.toLowerCase()} concept. I can create the private foundation now; full AI game generation is coming soon.` }])
    setPrompt('')
    setSaving(true)
    try { await createProject({ name: inferred.name, genre: inferred.genre, description: request }); setCreated(inferred) } catch { setMessages((current) => [...current, { role: 'assistant', content: 'I couldn’t create the project yet. Check your connection and try again.' }]) } finally { setSaving(false) }
  }

  return <section className="overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-2xl shadow-primary/5"><div className="border-b border-border bg-primary/[0.06] px-5 py-4 md:px-7"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Game Lab AI</p><h2 className="mt-1 text-lg font-semibold">What do you want to create?</h2></div><span className="ml-auto rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">V0.1 brief mode</span></div></div><div className="space-y-4 p-5 md:p-7"><div className="max-h-72 space-y-3 overflow-y-auto pr-1">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}><span className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${message.role === 'user' ? 'bg-secondary text-muted-foreground' : 'bg-primary/15 text-primary'}`}>{message.role === 'user' ? <UserRound className="size-3.5" /> : <Bot className="size-3.5" />}</span><p className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-secondary' : 'bg-muted/60 text-muted-foreground'}`}>{message.content}</p></div>)}</div>{created ? <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4"><Check className="mt-0.5 size-4 text-emerald-400" /><div className="flex-1"><p className="text-sm font-semibold">{created.name} is ready to shape.</p><p className="mt-1 text-xs text-muted-foreground">Private {created.genre.toLowerCase()} foundation created from your conversation.</p></div><button onClick={() => router.push('/projects')} className="text-xs font-semibold text-emerald-300 hover:text-emerald-200">Open projects</button></div> : <><div className="flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setPrompt(suggestion)} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">{suggestion}</button>)}</div><form onSubmit={submit} className="flex items-end gap-2 rounded-2xl border border-input bg-background p-2 focus-within:border-primary/60"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} rows={2} maxLength={500} placeholder="Generate a Spider-Man 3D-ish game…" className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground/60" aria-label="Describe the game you want to create" /><button disabled={!canSend} className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40" aria-label="Create project from idea">{saving ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}</button></form><p className="text-center text-[11px] text-muted-foreground">AI generation is not connected yet. Your message creates the initial project metadata only.</p></>}</div></section>
}
