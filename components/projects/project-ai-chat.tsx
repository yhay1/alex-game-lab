'use client'

import { FormEvent, KeyboardEvent, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, Bot, ChevronDown, FilePlus2, ImageIcon, Loader2, Play, Plus, Sparkles, UserRound, X } from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mention = getActiveAssetMention(prompt, cursor)
  const suggestions = mention ? rankAssetReferences(assets, mention.query).slice(0, 6) : []

  function chooseAsset(asset: AssetReference) {
    if (!mention) return
    const result = insertAssetMention(prompt, mention, asset, cursor)
    setPrompt(result.value); setSelected((current) => current.some((item) => item.id === asset.id) ? current : [...current, asset])
    requestAnimationFrame(() => { textareaRef.current?.focus(); textareaRef.current?.setSelectionRange(result.cursor, result.cursor) })
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); const text = prompt.trim(); if (!text || loading) return
    const next = [...messages, { role: 'user' as const, content: text }]; setMessages(next); setPrompt(''); setLoading(true); setIntent(detectAssetIntent(text))
    try {
      const response = await fetch(`/api/projects/${projectId}/ai`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next, assetReferences: selected.map(({ id }) => ({ id })), intent }) })
      if (!response.ok || !response.body) throw new Error('AI request failed')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = ''
      setMessages((current) => [...current, { role: 'assistant', content: '' }])
      while (true) { const { done, value } = await reader.read(); if (done) break; answer += decoder.decode(value, { stream: true }); setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: answer } : item)) }
    } catch { setMessages((current) => [...current, { role: 'assistant', content: 'I couldn’t reach the project AI right now. Try again in a moment.' }]) } finally { setLoading(false) }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }

  return <section className="flex min-h-[620px] flex-col overflow-hidden rounded-lg border border-border bg-card/90 shadow-sm">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-5"><div className="flex min-w-0 items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><div className="min-w-0"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Project intelligence</p><h2 className="truncate text-sm font-semibold">AI workspace</h2></div><span className="hidden rounded-full border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground sm:inline-flex">DRAFT CONTEXT</span></div><div className="flex items-center gap-2"><Link href={`/projects/${projectId}/workspace`} className="hidden items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted sm:inline-flex"><Bot className="size-3.5" />Workspace</Link><Link href={`/play/${projectId}`} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Play className="size-3.5" />Playtest</Link></div></header>
    <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-5">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}><span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${message.role === 'user' ? 'bg-secondary text-muted-foreground' : 'bg-primary/15 text-primary'}`}>{message.role === 'user' ? <UserRound className="size-3.5" /> : <Bot className="size-3.5" />}</span><div className={`max-w-[88%] rounded-lg border px-3 py-3 text-sm leading-6 ${message.role === 'user' ? 'border-border bg-secondary' : 'border-border/70 bg-muted/40 text-muted-foreground'}`}>{message.content || <Loader2 className="size-4 animate-spin" />}</div></div>)}</div>
    {intent !== 'exact' && <div className="border-t border-border bg-muted/30 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Asset intent detected: <span className="text-foreground">{intent}</span></div>}
    <form onSubmit={submit} className="relative border-t border-border bg-background/70 p-3 md:p-4"><div className="rounded-md border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring"><textarea ref={textareaRef} value={prompt} onChange={(event) => { setPrompt(event.target.value); setCursor(event.target.selectionStart ?? 0) }} onSelect={(event) => setCursor(event.currentTarget.selectionStart ?? 0)} onKeyDown={handleKeyDown} placeholder="Describe what you want to build..." rows={3} className="min-h-20 w-full resize-none bg-transparent px-3 py-3 text-sm leading-6 outline-none placeholder:text-muted-foreground" aria-label="Describe what you want to build" /><div className="flex items-center justify-between border-t border-border px-2 py-2"><div className="relative"><button type="button" onClick={() => setMenuOpen(!menuOpen)} className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"><Plus className="size-3.5" />Add context<ChevronDown className="size-3" /></button>{menuOpen && <div className="absolute bottom-9 left-0 z-10 flex min-w-40 flex-col gap-1 rounded-md border border-border bg-popover p-1 text-xs shadow-lg"><button type="button" onClick={() => { setPrompt((value) => `${value}@`); setMenuOpen(false); textareaRef.current?.focus() }} className="flex items-center gap-2 rounded px-2 py-2 text-left hover:bg-muted"><ImageIcon className="size-3.5" />Mention asset</button><button type="button" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded px-2 py-2 text-left hover:bg-muted"><FilePlus2 className="size-3.5" />Attach brief</button></div>}</div><div className="flex items-center gap-2"><span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">SHIFT + ENTER FOR NEW LINE</span><button type="submit" disabled={loading || !prompt.trim()} aria-label={loading ? 'Applying request' : 'Send request'} className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50">{loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}</button></div></div></div>{mention && suggestions.length > 0 && <div className="absolute bottom-[8.5rem] left-3 right-3 z-10 overflow-hidden rounded-md border border-border bg-popover shadow-xl md:left-4 md:right-4"><div className="border-b border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Favorite assets</div>{suggestions.map((asset) => <button type="button" key={asset.id} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseAsset(asset)} className="flex w-full items-center gap-3 px-3 py-2 text-left text-xs hover:bg-muted"><span className="flex size-7 items-center justify-center rounded bg-secondary"><ImageIcon className="size-3.5 text-muted-foreground" /></span><span className="min-w-0 flex-1"><span className="block truncate font-medium">{asset.name}</span><span className="block truncate text-[10px] text-muted-foreground">Asset · {asset.id.slice(0, 8)}</span></span></button>)}</div>}</form>
    {selected.length > 0 && <div className="flex flex-wrap gap-2 border-t border-border px-4 py-2">{selected.map((asset) => <span key={asset.id} className="inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground">@{asset.name}<button type="button" onClick={() => setSelected((current) => current.filter((item) => item.id !== asset.id))} aria-label={`Remove ${asset.name}`}><X className="size-3" /></button></span>)}</div>}
  </section>
}
