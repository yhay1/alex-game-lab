import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { getCurrentUser, getProfile, listProjects } from '@/lib/data/game-lab'
import { GameLabShell } from '@/components/game-lab-shell'
import { OwnedProjectCard } from '@/components/projects/owned-project-card'

export default async function ProjectsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const [projects, profile] = await Promise.all([listProjects(), getProfile(user.id).catch(() => null)])
  const name = profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'
  const owned = projects.map((project) => ({ ...project, owner: { display_name: name, avatar_url: profile?.avatar_url ?? null } }))
  return <GameLabShell name={name}><div className="mx-auto max-w-6xl"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Home</Link><header className="mt-8 flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Build / Projects</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Your projects</h1><p className="mt-3 max-w-xl text-muted-foreground">Every game foundation you create, in the same visual language as the community feed.</p></div><Link href="/dashboard#creation-chat" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"><Sparkles className="size-4" />Create with AI</Link></header>{owned.length === 0 ? <section className="mt-12 rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center"><Sparkles className="mx-auto size-7 text-primary" /><h2 className="mt-5 text-xl font-semibold">Your project shelf is empty.</h2><p className="mx-auto mt-2 max-w-md text-muted-foreground">Start a conversation on Home to create your first project foundation.</p><Link href="/dashboard#creation-chat" className="mt-6 inline-flex rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Start creating</Link></section> : <section className="mt-10 grid gap-5 md:grid-cols-2">{owned.map((project) => <OwnedProjectCard key={project.id} project={project} />)}</section>}</div></GameLabShell>
}
