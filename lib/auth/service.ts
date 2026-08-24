import { createClient } from '@/lib/supabase/client'

const redirectUrl = () =>
  process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`

export function authErrorMessage(error: { message?: string; status?: number } | null) {
  if (!error) return null
  const message = error.message?.toLowerCase() ?? ''
  if (error.status === 429 || message.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.'
  if (message.includes('email not confirmed')) return 'Check your inbox to confirm your email before signing in.'
  if (message.includes('password') && (message.includes('weak') || message.includes('short'))) return 'Use a stronger password with at least 8 characters.'
  if (message.includes('invalid login credentials') || message.includes('invalid email or password')) return 'Invalid email or password.'
  return 'Something unexpected happened. Please try again.'
}

export async function signIn(email: string, password: string) {
  return createClient().auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string, displayName: string) {
  return createClient().auth.signUp({
    email,
    password,
    options: { emailRedirectTo: redirectUrl(), data: { display_name: displayName } },
  })
}

export async function signOut() {
  return createClient().auth.signOut()
}

export function subscribeToAuthChanges(callback: Parameters<ReturnType<typeof createClient>['auth']['onAuthStateChange']>[0]) {
  return createClient().auth.onAuthStateChange(callback)
}
