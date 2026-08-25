import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, getProject, getProfile } from '@/lib/data/game-lab'
import { GameLabShell } from '@/components/game-lab-shell'
import { ProjectWorkspaceShell } from '@/components/projects/project-workspace-shell'

export default async function ProjectWorkspaceLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const { id } = await params
  let project
  try { project = await getProject(id) } catch { notFound() }
  if (project.owner_id !== user.id) notFound()
  const profile = await getProfile(user.id).catch(() => null)
  const name = profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'
  return <GameLabShell name={name}><ProjectWorkspaceShell project={project}>{children}</ProjectWorkspaceShell></GameLabShell>
}
