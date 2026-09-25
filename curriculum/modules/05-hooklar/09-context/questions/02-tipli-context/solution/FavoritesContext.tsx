import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
const FavoritesContext = createContext<number[] | null>(null)
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids] = useState([550])
  return <FavoritesContext value={ids}>{children}</FavoritesContext>
}
export function useFavorites() {
  const value = useContext(FavoritesContext)
  if (value === null) throw new Error('useFavorites, FavoritesProvider içinde kullanılmalı')
  return value
}
