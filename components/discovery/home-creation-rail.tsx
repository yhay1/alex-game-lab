'use client'

import Link from 'next/link'
import { ArrowRight, FolderKanban, Sparkles } from 'lucide-react'
import type { GameProject } from '@/lib/data/game-lab'
import { CreationChat } from '@/components/discovery/creation-chat'

export function HomeCreationRail({ projects }: { projects: GameProject[] }) {
  return (
    <section aria-labelledby="creation-rail-title" className="mt-8">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Build / Home</p>
          <h2 id="creation-rail-title" className="mt-2 text-2xl font-semibold">Start creating or pick up a project</h2>
        </div>
        <span className="text-xs text-muted-foreground">Swipe to browse</span>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-none sm:-mx-0 sm:px-0">
        <div className="w-[calc(100vw-2rem)] max-w-3xl shrink-0 snap-start md:w-[min(72vw,48rem)]">
          <CreationChat />
        </div>
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="group flex min-h-[22rem] w-[17rem] shrink-0 snap-start flex-col justify-between rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-secondary/40 sm:w-72">
            <div><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FolderKanban className="size-5" /></span><p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Recent project</p><h3 className="mt-2 text-xl font-semibold leading-tight">{project.name}</h3><p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">{project.description || 'No project brief yet.'}</p></div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Open workspace<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        ))}
        {projects.length === 0 && <div className="flex min-h-[22rem] w-[17rem] shrink-0 snap-start flex-col justify-between rounded-3xl border border-dashed border-border bg-card/50 p-5 sm:w-72"><div><span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground"><Sparkles className="size-5" /></span><h3 className="mt-8 text-xl font-semibold">Your projects appear here</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Send a brief in the AI chat to create your first private project.</p></div><span className="text-xs text-muted-foreground">No projects yet</span></div>}
      </div>
    </section>
  )
}

