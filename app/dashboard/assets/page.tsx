import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Images, ArrowRight } from 'lucide-react'
import { getCurrentUser, getProfile, listProjects, listProjectAssets } from '@/lib/data/game-lab'
import { GameLabShell } from '@/components/game-lab-shell'

export default async function AssetsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const [profile, projects] = await Promise.all([getProfile(user.id).catch(() => null), listProjects()])
  const name = profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'
  const assetGroups = await Promise.all(projects.map(async (project) => ({ project, assets: await listProjectAssets(project.id).catch(() => []) })))
  const total = assetGroups.reduce((sum, group) => sum + group.assets.length, 0)
  return <GameLabShell name={name}><div className="max-w-5xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Library</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Assets</h1><p className="mt-2 text-muted-foreground">Private creative files organized by project.</p><section className="mt-8 rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary"><Images className="size-5" /></span><div><p className="text-2xl font-semibold">{total}</p><p className="text-sm text-muted-foreground">Uploaded assets</p></div></div></section>{projects.length === 0 ? <section className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center"><h2 className="font-semibold">No projects yet</h2><p className="mt-2 text-sm text-muted-foreground">Create a project before adding assets.</p><Link href="/dashboard/create" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Create Game <ArrowRight className="size-4" /></Link></section> : <section className="mt-6 grid gap-4 md:grid-cols-2">{assetGroups.map(({ project, assets }) => <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/60"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{project.name}</h2><ArrowRight className="size-4 text-muted-foreground" /></div><p className="mt-2 text-sm text-muted-foreground">{assets.length} {assets.length === 1 ? 'asset' : 'assets'} in this workspace</p></Link>)}</section>}</div></GameLabShell>
}
