import { listAssets } from '@/lib/data/assets'
import { ProjectDetail } from '@/components/projects/project-detail'
import { ProjectSettings } from '@/components/projects/project-settings'
import { WorkspacePlaceholder } from '@/components/game-lab-shell'
import { getProject } from '@/lib/data/game-lab'
import { notFound } from 'next/navigation'

export default async function ProjectOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  const assets = await listAssets(id)
  return <div><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Overview</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance">Shape the next playable build.</h2><p className="mt-2 max-w-2xl text-muted-foreground">Keep the project identity, foundation, and playable surface close at hand.</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize">{project.status}</span></div><div className="grid gap-4 xl:grid-cols-[1fr_320px]"><div className="flex flex-col gap-4"><ProjectSettings project={project} /><ProjectDetail project={project} /></div><aside className="flex flex-col gap-4"><WorkspacePlaceholder icon="box" title="Game preview" description="Run the current foundation from Playtest when you are ready to check the loop." className="min-h-48" /><WorkspacePlaceholder icon="layers" title="Foundation snapshot" description={`${project.foundation?.levels?.length ?? 0} levels · ${project.foundation?.entities?.length ?? 0} entities · ${assets.length} assets`} /></aside></div></div>
}
