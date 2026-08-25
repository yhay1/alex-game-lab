import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, FolderKanban, Plus, Sparkles, WandSparkles } from 'lucide-react'
import { getCurrentUser, getProfile, listProjects } from '@/lib/data/game-lab'
import { GameLabShell } from '@/components/game-lab-shell'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const [profile, projects] = await Promise.all([getProfile(user.id).catch(() => null), listProjects()])
  const name = profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'
  const recentProjects = projects.slice(0, 3)

  return <GameLabShell name={name}>
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Home / Dashboard</p><h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Build something worth playing.</h1><p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Welcome back, {name}. Your projects, assets, and next build step are all in one place.</p></div>
          <Link href="/create" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />New project</Link>
        </div>
        <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-3"><div><p className="text-2xl font-semibold">{projects.length}</p><p className="text-sm text-muted-foreground">Projects in your lab</p></div><div><p className="text-2xl font-semibold">2D</p><p className="text-sm text-muted-foreground">Current build format</p></div><div><p className="text-2xl font-semibold">Private</p><p className="text-sm text-muted-foreground">Your workspace visibility</p></div></div>
      </header>
      <section className="mt-8 rounded-3xl border border-primary/30 bg-primary/5 p-6 md:p-8"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2 text-primary"><WandSparkles className="size-5" /><span className="font-mono text-xs uppercase tracking-[0.2em]">AI creation</span></div><h2 className="mt-3 text-2xl font-semibold">Turn an idea into a game foundation.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Describe your game concept and we&apos;ll help shape the project structure. AI-assisted generation is coming soon; for now, start with a focused project brief.</p></div><Link href="/create" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary/40 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10">Start with a brief<ArrowRight className="size-4" /></Link></div></section>
      <section className="mt-10"><div className="flex items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Your work</p><h2 className="mt-2 text-2xl font-semibold">Recent projects</h2></div><Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">View all<ArrowRight className="size-4" /></Link></div>{recentProjects.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-border p-8 text-center"><FolderKanban className="mx-auto size-7 text-primary" /><h3 className="mt-4 font-semibold">Your first game starts here.</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Create a project to establish its genre, description, and private workspace.</p><Link href="/create" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Create project<Plus className="size-4" /></Link></div> : <div className="mt-5 grid gap-4 md:grid-cols-3">{recentProjects.map((project) => <Link key={project.id} href={`/projects/${project.id}`} className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/60"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{project.genre ?? 'Genre pending'}</span><span className="text-xs text-muted-foreground">{project.status}</span></div><h3 className="mt-8 text-lg font-semibold group-hover:text-primary">{project.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{project.description || 'No description yet.'}</p></Link>)}</div>}</section>
      <section className="mt-10 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center gap-2 text-primary"><Sparkles className="size-4" /><h2 className="font-semibold">What&apos;s next</h2></div><p className="mt-3 text-sm leading-6 text-muted-foreground">Project editing and private asset organization are ready now. Preview, publishing, analytics, and collaboration are planned for later releases.</p></div><div className="rounded-2xl border border-border bg-card p-5"><h2 className="font-semibold">Keep your lab focused</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Use Projects to manage game foundations, Workspace to edit one project, and Assets to find files across your lab.</p></div></section>
    </div>
  </GameLabShell>
}
