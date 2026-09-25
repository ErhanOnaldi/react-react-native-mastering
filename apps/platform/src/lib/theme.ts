import { useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const listeners = new Set<() => void>()

function current(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('rm-theme', theme)
  } catch {
    // gizli sekme vb. — tercih yalnızca bu oturumda geçerli olur
  }
  for (const l of listeners) l()
}

export function useTheme() {
  const theme = useSyncExternalStore((listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, current)
  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}
