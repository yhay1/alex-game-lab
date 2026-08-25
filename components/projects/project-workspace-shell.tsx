'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Box, FolderKanban, Images, Layers3, PanelLeft, Play, Settings2, Sparkles, SlidersHorizontal } from 'lucide-react'
import type { GameProject } from '@/lib/data/game-lab-types'

const sections = [
  { slug: '', label: 'Overview', icon: FolderKanban },
  { slug: 'ai', label: 'AI', icon: Sparkles },
  { slug: 'workspace', label: 'Workspace', icon: PanelLeft },
  { slug: 'assets', label: 'Assets', icon: Images },
  { slug: 'scenes', label: 'Scenes', icon: Layers3 },
  { slug: 'customize', label: 'Customize', icon: SlidersHorizontal },
  { slug: 'settings', label: 'Settings', icon: Settings2 },
  { slug: 'versions', label: 'Versions', icon: Box },
  { slug: 'publish', label: 'Publish', icon: Play },
]

export function ProjectWorkspaceShell({ project, children }: { project: GameProject; children: React.ReactNode }) {
  const pathname = usePathname()
  const base = `/projects/${project.id}`
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/projects" className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground" aria-label="Back to projects"><ArrowLeft className="size-4" /></Link>
            <div className="min-w-0"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Project workspace</p><h1 className="truncate text-lg font-semibold">{project.name}</h1></div>
          </div>
          <Link href={`/play/${project.id}`} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"><Play className="size-4" />Playtest</Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1500px] flex-col md:flex-row">
        <nav className="border-b border-border bg-sidebar px-3 py-3 md:min-h-[calc(100vh-73px)] md:w-56 md:border-b-0 md:border-r md:px-4 md:py-6" aria-label="Project sections">
          <div className="flex gap-1 overflow-x-auto md:flex-col md:gap-2">{sections.map(({ slug, label, icon: Icon }) => { const href = slug ? `${base}/${slug}` : base; const active = pathname === href; return <Link key={label} href={href} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-sidebar-accent text-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'}`}><Icon className="size-4" />{label}</Link> })}</div>
        </nav>
        <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}

export const projectSections = sections
