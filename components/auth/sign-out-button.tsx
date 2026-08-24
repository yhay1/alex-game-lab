'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth/service'

export function SignOutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  async function handleSignOut() { setPending(true); await signOut(); router.push('/auth/sign-in'); router.refresh() }
  return <Button variant="outline" onClick={handleSignOut} disabled={pending}>{pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <LogOut data-icon="inline-start" />}Sign out</Button>
}
