'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: 'system', setTheme: () => undefined })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    const stored = window.localStorage.getItem('alex-theme') as Theme | null
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
  })
  useEffect(() => {
    applyTheme(theme)
  }, [theme])
  function setTheme(next: Theme) { setThemeState(next); window.localStorage.setItem('alex-theme', next); applyTheme(next) }
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

function applyTheme(theme: Theme) {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

export function useTheme() { return useContext(ThemeContext) }
