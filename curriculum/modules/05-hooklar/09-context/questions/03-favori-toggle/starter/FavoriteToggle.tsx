import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
const Context = createContext<{ ids: number[]; toggle: (id: number) => void } | null>(null)
export function Provider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
export function FavoriteToggle({ id }: { id: number }) {
  return <button type="button">Favori</button>
}
