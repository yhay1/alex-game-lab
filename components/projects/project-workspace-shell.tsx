'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Box, FolderKanban, Images, Layers3, PanelLeft, Play, Settings2, Sparkles, SlidersHorizontal, MoreHorizontal } from 'lucide-react'
import type { GameProject } from '@/lib/data/game-lab-types'
import { ThemeSwitcher } from '@/components/theme-switcher'

const primarySections = [
  { slug: 'ai', label: 'AI', icon: Sparkles },
  { slug: 'workspace', label: 'Workspace', icon: PanelLeft },
  { slug: 'assets', label: 'Assets', icon: Images },
  { slug: 'scenes', label: 'Scenes', icon: Layers3 },
  { slug: 'customize', label: 'Customize', icon: SlidersHorizontal },
]
const secondarySections = [
  { slug: '', label: 'Overview', icon: FolderKanban },
  { slug: 'settings', label: 'Settings', icon: Settings2 },
  { slug: 'versions', label: 'Versions', icon: Box },
  { slug: 'publish', label: 'Publish', icon: Play },
]
const sections = [...secondarySections, ...primarySections]

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
          <div className="flex items-center gap-2"><ThemeSwitcher /><Link href={`/play/${project.id}`} className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"><Play className="size-4" />Playtest</Link></div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1500px] flex-col md:flex-row">
        <nav className="border-b border-border bg-sidebar px-3 py-3 md:min-h-[calc(100vh-73px)] md:w-60 md:border-b-0 md:border-r md:px-4 md:py-5" aria-label="Project sections">
          <div className="mb-3 flex items-center justify-between px-2"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Build tools</span><span className="hidden font-mono text-[10px] text-muted-foreground md:inline">⌘K</span></div>
          <div className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible">{primarySections.map(({ slug, label, icon: Icon }) => { const href = `${base}/${slug}`; const active = pathname === href; return <Link key={label} href={href} className={`flex min-h-10 shrink-0 items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors ${active ? 'border-sidebar-border bg-sidebar-accent text-foreground shadow-sm' : 'text-muted-foreground hover:border-sidebar-border hover:bg-sidebar-accent hover:text-foreground'}`}><Icon className="size-4" />{label}</Link> })}</div>
          <div className="my-4 border-t border-sidebar-border" />
          <div className="flex flex-wrap gap-1 md:flex-col md:gap-1">{secondarySections.map(({ slug, label, icon: Icon }) => { const href = slug ? `${base}/${slug}` : base; const active = pathname === href; return <Link key={label} href={href} className={`flex min-h-9 shrink-0 items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors ${active ? 'border-sidebar-border bg-sidebar-accent text-foreground shadow-sm' : 'text-muted-foreground hover:border-sidebar-border hover:bg-sidebar-accent hover:text-foreground'}`}><Icon className="size-4" />{label}</Link> })}</div>
          <details className="mt-4 md:hidden"><summary className="flex min-h-10 cursor-pointer list-none items-center justify-center gap-2 rounded-md border border-sidebar-border px-3 text-sm text-muted-foreground"><MoreHorizontal className="size-4" />Project menu</summary></details>
        </nav>
        <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}

export const projectSections = sections
