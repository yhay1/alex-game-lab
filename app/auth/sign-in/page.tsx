import { AuthForm } from '@/components/auth/auth-form'

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  return <AuthForm mode="sign-in" initialError={params.error === 'confirmation' ? 'Your confirmation link could not be completed. Please try signing in again.' : undefined} />
}
