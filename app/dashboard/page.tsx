import { redirect } from 'next/navigation'
import { LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser, getProfile, listProjects } from '@/lib/data/game-lab'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const [profile, projects] = await Promise.all([
    getProfile(user.id).catch(() => null),
    listProjects(),
  ])
  const name = profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'
  return <main className="min-h-screen px-5 py-8 md:px-10"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Protected creator space</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {name}.</h1><p className="mt-1 text-muted-foreground">Your authenticated Alex Game Lab dashboard.</p></div><SignOutButton /></header><section className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-border bg-card p-6"><ShieldCheck className="size-5 text-primary" /><p className="mt-5 text-sm text-muted-foreground">Session</p><p className="mt-1 font-medium">Persistent and secure</p></div><div className="rounded-2xl border border-border bg-card p-6"><p className="text-3xl font-semibold">{projects.length}</p><p className="mt-2 text-sm text-muted-foreground">Projects in your workspace</p></div><div className="rounded-2xl border border-border bg-card p-6"><p className="text-3xl font-semibold">{user.email}</p><p className="mt-2 text-sm text-muted-foreground">Signed-in email</p></div></section><section className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-8"><h2 className="text-lg font-semibold">Creator dashboard foundation</h2><p className="mt-2 max-w-2xl leading-6 text-muted-foreground">Authentication is connected. Future game creation systems will land here without changing the session boundary or data layer.</p></section></div></main>
}
