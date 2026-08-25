'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Gamepad2, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authErrorMessage, signIn, signUp } from '@/lib/auth/service'

export function AuthForm({ mode, initialError }: { mode: 'sign-in' | 'sign-up'; initialError?: string }) {
  const router = useRouter()
  const isSignUp = mode === 'sign-up'
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(initialError ?? null)
  const [notice, setNotice] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null); setNotice(null); setPending(true)
    try {
      const result = isSignUp ? await signUp(email.trim(), password, displayName.trim()) : await signIn(email.trim(), password)
      if (result.error) { setError(authErrorMessage(result.error) ?? 'Unable to authenticate.'); return }
      if (isSignUp && !result.data.session) { setNotice('Check your inbox to confirm your email, then sign in.'); return }
      router.push('/dashboard'); router.refresh()
    } catch { setError('Authentication is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the project.') }
    finally { setPending(false) }
  }

  return <main className="flex min-h-screen items-center justify-center px-5 py-10"><div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl lg:grid-cols-[0.9fr_1.1fr]"><section className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex"><div><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15"><Gamepad2 /></span><span className="font-semibold tracking-tight">Alex Game Lab</span></div><div className="mt-24 max-w-sm"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground/65">Creator workspace</p><h1 className="mt-4 text-4xl font-semibold leading-tight text-balance">Turn a blank canvas into something playable.</h1><p className="mt-5 leading-7 text-primary-foreground/75">A focused home for shaping worlds, scenes, and ideas into 2D games.</p></div></div><div className="flex items-center gap-2 text-sm text-primary-foreground/70"><Sparkles className="size-4" />Built for curious creators</div></section><section className="p-6 sm:p-10"><div className="mb-10 flex items-center gap-3 lg:hidden"><span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Gamepad2 className="size-4" /></span><span className="font-semibold">Alex Game <span className="text-primary">Lab</span></span></div><div className="mx-auto max-w-md"><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{isSignUp ? 'Create your account' : 'Welcome back'}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{isSignUp ? 'Start building.' : 'Ready to create?'}</h2><p className="mt-2 leading-6 text-muted-foreground">{isSignUp ? 'Set up your creator profile to enter the lab.' : 'Sign in to continue to your creator dashboard.'}</p><form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">{isSignUp && <div className="flex flex-col gap-2"><Label htmlFor="display-name">Display name</Label><Input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" required /></div>}<div className="flex flex-col gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div><div className="flex flex-col gap-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength={8} required /></div>{error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{notice && <p role="status" className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">{notice}</p>}<Button type="submit" disabled={pending} className="w-full">{pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}{pending ? 'Working...' : isSignUp ? 'Create account' : 'Sign in'}</Button></form><p className="mt-6 text-center text-sm text-muted-foreground">{isSignUp ? 'Already have an account?' : 'New to Game Lab?'} <Link href={isSignUp ? '/auth/sign-in' : '/auth/sign-up'} className="font-semibold text-primary hover:underline">{isSignUp ? 'Sign in' : 'Create an account'}</Link></p></div></section></div></main>
}

export default AuthForm
