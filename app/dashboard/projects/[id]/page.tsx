import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser, getProject, getProfile } from '@/lib/data/game-lab'
import { listAssets } from '@/lib/data/assets'
import { ProjectDetail } from '@/components/projects/project-detail'
import { ProjectSettings } from '@/components/projects/project-settings'
import { AssetManager } from '@/components/projects/asset-manager'
import { GameLabShell, WorkspacePlaceholder } from '@/components/game-lab-shell'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  if (project.owner_id !== user.id) notFound()
  const [assets, profile] = await Promise.all([listAssets(id), getProfile(user.id).catch(() => null)])
  const name = profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'
  return <GameLabShell name={name}><Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />My Projects</Link><header className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Project workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{project.name}</h1><p className="mt-2 max-w-xl text-muted-foreground">Edit the project foundation, identity, and assets here.</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs">{project.genre ?? 'Genre pending'}</span></header><div className="mt-8 grid gap-4 xl:grid-cols-[1fr_320px]"><div className="flex flex-col gap-4"><ProjectSettings project={project} /><ProjectDetail project={project} /><AssetManager projectId={id} initialAssets={assets} /></div><aside className="flex flex-col gap-4"><WorkspacePlaceholder icon="box" title="Game preview" description="The playable preview surface is reserved for a future engine integration." className="min-h-56" /><WorkspacePlaceholder icon="layers" title="Levels & entities" description="Scene structure and entity editing are coming soon." /><WorkspacePlaceholder icon="sparkles" title="AI generation" description="AI-powered game generation is coming soon." /></aside></div></GameLabShell>
}
