'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gamepad2, LayoutDashboard, FolderKanban, Plus, Settings, Menu, X, Images, Box, Crosshair, Settings2, Layers3, SlidersHorizontal, UserRound, Bell, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { SignOutButton } from '@/components/auth/sign-out-button'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'My Projects', icon: FolderKanban },
  { href: '/assets', label: 'Assets', icon: Images },
  { href: '/create', label: 'Create Game', icon: Plus },
]

export function GameLabShell({ children, name }: { children: React.ReactNode; name: string }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-background text-foreground lg:flex">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar p-5 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between"><Link href="/dashboard" className="flex items-center gap-3 font-semibold tracking-tight"><span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Gamepad2 className="size-5" /></span><span>Alex Game Lab</span></Link><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X className="size-5" /></button></div>
      <nav className="mt-10 flex flex-col gap-2">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${pathname === href ? 'bg-sidebar-accent text-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'}`}><Icon className="size-4" />{label}</Link>)}</nav>
      <div className="mt-auto flex flex-col gap-2"><Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"><Settings className="size-4" />Account & Settings</Link><div className="border-t border-sidebar-border pt-4"><p className="truncate px-3 text-xs text-muted-foreground">{name}</p><div className="mt-2 px-1"><SignOutButton /></div></div></div>
    </aside>
    {open && <button className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
    <div className="min-w-0 flex-1"><header className="flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur lg:hidden"><button onClick={() => setOpen(true)} aria-label="Open navigation"><Menu className="size-5" /></button><span className="text-sm font-semibold">Alex Game Lab</span><Link href="/settings" aria-label="Settings"><Settings className="size-5 text-muted-foreground" /></Link></header><div className="mx-auto max-w-[1500px] p-5 md:p-8">{children}</div></div>
  </div>
}

const placeholderIcons = { box: Box, layers: Layers3, sliders: SlidersHorizontal, user: UserRound, bell: Bell, shield: ShieldCheck, settings: Settings, sparkles: Sparkles, crosshair: Crosshair, controls: Settings2 }

export function WorkspacePlaceholder({ icon, title, description, className = '' }: { icon: keyof typeof placeholderIcons; title: string; description: string; className?: string }) { const Icon = placeholderIcons[icon] ?? Box; return <section className={`rounded-2xl border border-border bg-card p-5 ${className}`}><div className="flex items-start gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div></div></section> }
