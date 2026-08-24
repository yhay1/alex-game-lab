import { redirect } from 'next/navigation'
import { getCurrentUser, getProfile } from '@/lib/data/game-lab'
import { ProjectForm } from '@/components/projects/project-form'
import { GameLabShell } from '@/components/game-lab-shell'

export default async function CreateGamePage() { const user = await getCurrentUser(); if (!user) redirect('/auth/sign-in'); const profile = await getProfile(user.id).catch(() => null); const name = profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'; return <GameLabShell name={name}><div className="mx-auto max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">New project</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Create a new game</h1><p className="mt-2 text-muted-foreground">Start with a clear idea. You can shape the full foundation inside the workspace.</p><div className="mt-8 rounded-2xl border border-border bg-card p-6"><ProjectForm /></div></div></GameLabShell> }
