'use client'

import Link from 'next/link'
import { FolderOpen, Heart, MessageCircle, Star } from 'lucide-react'

type Project = {
  id: string
  name: string
  genre: string | null
  status: string
  cover_image_url?: string | null
  owner?: { display_name?: string | null; avatar_url?: string | null } | null
  like_count?: number | null
  review_count?: number | null
  rating?: number | null
}

export function OwnedProjectCard({ project }: { project: Project }) {
  const owner = project.owner?.display_name ?? 'You'
  return <Link href={`/projects/${project.id}`} className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5">
    <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
      {project.cover_image_url ? <img src={project.cover_image_url} alt={`${project.name} cover`} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex size-full items-center justify-center bg-gradient-to-br from-secondary to-muted text-muted-foreground"><FolderOpen className="size-8" /></div>}
      <span className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{project.status}</span>
    </div>
    <div className="p-5"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="flex size-6 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-[10px] font-semibold text-primary">{project.owner?.avatar_url ? <img src={project.owner.avatar_url} alt="" className="size-full object-cover" /> : owner.slice(0, 1).toUpperCase()}</span><span>{owner}</span></div><h2 className="mt-4 text-xl font-semibold tracking-tight group-hover:text-primary">{project.name}</h2><p className="mt-1 text-sm text-muted-foreground">{project.genre ?? 'Genre pending'}</p><div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Heart className="size-3.5" />{project.like_count ?? '—'}</span><span className="inline-flex items-center gap-1.5"><MessageCircle className="size-3.5" />{project.review_count ?? '—'}</span><span className="ml-auto inline-flex items-center gap-1.5"><Star className="size-3.5" />{project.rating ?? '—'}</span></div></div>
  </Link>
}
