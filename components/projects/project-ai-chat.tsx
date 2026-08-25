'use client'

import { FormEvent, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, Bot, Loader2, Play, Plus, Sparkles, UserRound } from 'lucide-react'
import { getActiveAssetMention, insertAssetMention, rankAssetReferences, type AssetReference } from '@/lib/data/asset-references'
import { detectAssetIntent } from '@/lib/data/asset-intelligence'

type Message = { role: 'user' | 'assistant'; content: string }

export function ProjectAiChat({ projectId, projectName, assets = [] }: { projectId: string; projectName: string; assets?: AssetReference[] }) {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: `I’m ready to help shape ${projectName}. Ask about mechanics, scenes, pacing, or the next playable milestone.` }])
  const [prompt, setPrompt] = useState('')
  const [selected, setSelected] = useState<AssetReference[]>([])
  const [loading, setLoading] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [intent, setIntent] = useState('exact')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mention = getActiveAssetMention(prompt, cursor)
  const suggestions = mention ? rankAssetReferences(assets, mention.query).slice(0, 6) : []

  function chooseAsset(asset: AssetReference) {
    if (!mention) return
    const result = insertAssetMention(prompt, mention, asset, cursor)
    setPrompt(result.value)
    setSelected((current) => current.some((item) => item.id === asset.id) ? current : [...current, asset])
    requestAnimationFrame(() => { textareaRef.current?.focus(); textareaRef.current?.setSelectionRange(result.cursor, result.cursor) })
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    const text = prompt.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next); setPrompt(''); setLoading(true); setIntent(detectAssetIntent(text))
    try {
      const response = await fetch(`/api/projects/${projectId}/ai`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next, assetReferences: selected.map(({ id }) => ({ id })), intent }) })
      if (!response.ok || !response.body) throw new Error('AI request failed')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = ''
      setMessages((current) => [...current, { role: 'assistant', content: '' }])
      while (true) { const { done, value } = await reader.read(); if (done) break; answer += decoder.decode(value, { stream: true }); setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: answer } : item)) }
    } catch { setMessages((current) => [...current, { role: 'assistant', content: 'I couldn’t reach the project AI right now. Try again in a moment.' }]) } finally { setLoading(false) }
  }

  return <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Project intelligence</p><h2 className="font-semibold">AI workspace</h2></div></div><div className="flex gap-2"><Link href={`/projects/${projectId}/workspace`} className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted sm:inline-flex"><Bot className="size-3.5" />Workspace</Link><Link href={`/play/${projectId}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Play className="size-3.5" />Playtest</Link></div></div><div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${message.role === 'user' ? 'bg-secondary text-muted-foreground' : 'bg-primary/15 text-primary'}`}>{message.role === 'user' ? <UserRound className="size-4" /> : <Bot className="size-4" />}</span><div className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-secondary' : 'bg-muted/60 text-muted-foreground'}`}>{message.content || <Loader2 className="size-4 animate-spin" />}</div></div>)}</div>{intent !== 'exact' && <div className="border-t border-border bg-muted/30 px-5 py-3 text-xs text-muted-foreground">Asset intent detected: <span className="font-medium text-foreground">{intent}</span>. The AI will prefer safe reuse before suggesting external or generated assets.</div>}<form onSubmit={submit} className="border-t border-border p-4"><div className="relative flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-primary">{selected.length > 0 && <div className="absolute bottom-full left-0 right-0 mb-2 flex flex-wrap gap-1">{selected.map((asset) => <button type="button" key={asset.id} onClick={() => setSelected((current) => current.filter((item) => item.id !== asset.id))} className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] text-primary">@{asset.name} ×</button>)}</div>}{mention && suggestions.length > 0 && <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl">{suggestions.map((asset) => <button type="button" key={asset.id} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseAsset(asset)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs hover:bg-muted"><span><strong>@{asset.name}</strong><span className="ml-2 text-muted-foreground">{asset.kind}</span></span><span className="text-muted-foreground">{asset.tags.slice(0, 2).join(' · ')}</span></button>)}</div>}<button type="button" aria-label="Add asset reference" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Plus className="size-4" /></button><textarea ref={textareaRef} value={prompt} onChange={(event) => { setPrompt(event.target.value); setCursor(event.target.selectionStart) }} onClick={(event) => setCursor(event.currentTarget.selectionStart)} onKeyUp={(event) => setCursor(event.currentTarget.selectionStart)} placeholder="Ask about your game… Use @ to reference an asset" rows={2} className="min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground" /><button type="submit" disabled={loading || !prompt.trim()} aria-label="Send message" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"><ArrowUp className="size-4" /></button></div></form></section>
}
