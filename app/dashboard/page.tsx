import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Compass, Plus, WandSparkles } from 'lucide-react'
import { getCurrentUser, getProfile, listPublishedGames, listProjects } from '@/lib/data/game-lab'
import { GameLabShell } from '@/components/game-lab-shell'
import { DiscoveryEmptyState, GameCard } from '@/components/discovery/game-card'
import { HomeCreationRail } from '@/components/discovery/home-creation-rail'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const [profile, publishedGames, recentProjects] = await Promise.all([getProfile(user.id).catch(() => null), listPublishedGames(), listProjects(3)])
  const name = profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'

  return <GameLabShell name={name}><div className="mx-auto max-w-6xl"><header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-primary"><Compass className="size-4" /><p className="font-mono text-xs uppercase tracking-[0.2em]">Home / Discover</p></div><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">Find the next game worth playing.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Explore published projects from the Game Lab community, then return to your own private workspace to build.</p></div><a href="#creation-chat" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />Create with AI</a></header><HomeCreationRail projects={recentProjects} /><section className="mt-8 flex flex-col gap-4 rounded-3xl border border-primary/30 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between md:p-8"><div><div className="flex items-center gap-2 text-primary"><WandSparkles className="size-4" /><span className="font-mono text-xs uppercase tracking-[0.18em]">Creator shortcut</span></div><h2 className="mt-3 text-xl font-semibold">Continue shaping your ideas</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Open Projects to revisit your private game foundations. Publishing and community sharing will arrive in a future release.</p></div><Link href="/projects" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary">View your projects<ArrowRight className="size-4" /></Link></section><section className="mt-12"><div className="flex items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Community / Published</p><h2 className="mt-2 text-2xl font-semibold">Discover games</h2></div><span className="text-sm text-muted-foreground">{publishedGames.length} published</span></div><div className="mt-6">{publishedGames.length === 0 ? <DiscoveryEmptyState /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{publishedGames.map((game) => <GameCard key={game.id} game={game} />)}</div>}</div></section></div></GameLabShell>
}
