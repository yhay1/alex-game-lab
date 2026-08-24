import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser, getProject } from '@/lib/data/game-lab'
import { listAssets } from '@/lib/data/assets'
import { ProjectDetail } from '@/components/projects/project-detail'
import { AssetManager } from '@/components/projects/asset-manager'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(); if (!user) redirect('/auth/sign-in')
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  if (project.owner_id !== user.id) notFound()
  const assets = await listAssets(id)
  return <main className="min-h-screen px-5 py-8 md:px-10"><div className="mx-auto max-w-6xl"><Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All projects</Link><header className="my-8"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Project workspace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{project.name}</h1><p className="mt-2 text-muted-foreground">Shape the metadata and manage the creative files that belong to this game.</p></header><ProjectDetail project={project} /><AssetManager projectId={id} initialAssets={assets} /></div></main>
}
