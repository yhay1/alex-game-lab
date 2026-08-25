'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  return <div className="theme-switcher" role="group" aria-label="Theme">
    <button type="button" aria-label="Use light theme" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}><Sun data-icon="inline-start" /></button>
    <button type="button" aria-label="Use dark theme" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}><Moon data-icon="inline-start" /></button>
    <button type="button" aria-label="Use system theme" aria-pressed={theme === 'system'} onClick={() => setTheme('system')}><Monitor data-icon="inline-start" /></button>
  </div>
}
