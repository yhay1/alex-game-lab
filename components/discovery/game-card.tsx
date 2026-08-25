'use client'

import Link from 'next/link'
import { Heart, MessageCircle, Star } from 'lucide-react'
import type { GameProject } from '@/lib/data/game-lab-types'

export type DiscoveryGame = GameProject & {
  owner: { display_name: string | null; avatar_url: string | null } | null
  like_count: number | null
  review_count: number | null
  rating: number | null
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?'
}

export function GameCard({ game }: { game: DiscoveryGame }) {
  const ownerName = game.owner?.display_name || 'Game Lab creator'
  return <Link href={`/play/${game.id}`} className="group overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/60">
    <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
      {game.thumbnail_url ? <img src={game.thumbnail_url} alt={`${game.name} cover`} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /> : <div className="flex size-full items-center justify-center px-6 text-center"><span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Cover art not uploaded</span></div>}
      <span className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground backdrop-blur">{game.genre || 'Uncategorized'}</span>
    </div>
    <div className="p-5"><div className="flex items-center gap-3"><div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-xs font-semibold text-primary">{game.owner?.avatar_url ? <img src={game.owner.avatar_url} alt="" className="size-full object-cover" /> : initials(ownerName)}</div><span className="truncate text-sm text-muted-foreground">{ownerName}</span></div><h3 className="mt-4 text-xl font-semibold tracking-tight group-hover:text-primary">{game.name}</h3><p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">{game.description || 'A published Game Lab project.'}</p><div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Heart className="size-3.5" />{game.like_count ?? '—'}</span><span className="inline-flex items-center gap-1.5"><MessageCircle className="size-3.5" />{game.review_count ?? '—'}</span><span className="ml-auto inline-flex items-center gap-1.5 text-foreground"><Star className="size-3.5 fill-primary text-primary" />{game.rating === null ? 'Not rated' : game.rating.toFixed(1)}</span></div></div>
  </Link>
}

export function DiscoveryEmptyState() {
  return <div className="rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center md:p-16"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary"><Star className="size-6" /></div><h2 className="mt-5 text-2xl font-semibold tracking-tight">The community feed is waiting for its first release.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Published games will appear here once creators share them. Your private projects stay in Projects until publishing is available.</p></div>
}
