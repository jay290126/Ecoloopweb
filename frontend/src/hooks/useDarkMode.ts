import { useEffect, useMemo, useState } from 'react'

type Mode = 'light' | 'dark'

export function useDarkMode() {
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    localStorage.setItem('theme', mode)
  }, [mode])

  return useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      setMode,
    }),
    [mode],
  )
}

