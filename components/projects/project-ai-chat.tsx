'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, Bot, Loader2, Play, Sparkles, UserRound } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

export function ProjectAiChat({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: `I’m ready to help shape ${projectName}. Ask about mechanics, scenes, pacing, or the next playable milestone.` }])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    const text = prompt.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next); setPrompt(''); setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/ai`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) })
      if (!response.ok || !response.body) throw new Error('AI request failed')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = ''
      setMessages((current) => [...current, { role: 'assistant', content: '' }])
      while (true) { const { done, value } = await reader.read(); if (done) break; answer += decoder.decode(value, { stream: true }); setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: answer } : item)) }
    } catch { setMessages((current) => [...current, { role: 'assistant', content: 'I couldn’t reach the project AI right now. Try again in a moment.' }]) } finally { setLoading(false) }
  }

  return <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Project intelligence</p><h2 className="font-semibold">AI workspace</h2></div></div><div className="flex gap-2"><Link href={`/projects/${projectId}/workspace`} className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted sm:inline-flex"><Bot className="size-3.5" />Workspace</Link><Link href={`/play/${projectId}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Play className="size-3.5" />Playtest</Link></div></div><div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${message.role === 'user' ? 'bg-secondary text-muted-foreground' : 'bg-primary/15 text-primary'}`}>{message.role === 'user' ? <UserRound className="size-4" /> : <Bot className="size-4" />}</span><div className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-secondary' : 'bg-muted/60 text-muted-foreground'}`}>{message.content || <Loader2 className="size-4 animate-spin" />}</div></div>)}</div><form onSubmit={submit} className="border-t border-border p-4"><div className="flex items-end gap-3 rounded-xl border border-border bg-background p-2 focus-within:border-primary"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about your game..." rows={2} className="min-h-12 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none" aria-label="Message project AI" /><button type="submit" disabled={!prompt.trim() || loading} className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50" aria-label="Send message"><ArrowUp className="size-4" /></button></div><p className="mt-2 text-center text-[11px] text-muted-foreground">AI suggestions are reviewed before they change your project.</p></form></section>
}
