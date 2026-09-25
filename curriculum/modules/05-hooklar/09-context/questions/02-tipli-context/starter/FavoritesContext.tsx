import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
const FavoritesContext = createContext<number[] | null>(null)
export function FavoritesProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
export function useFavorites() {
  return useContext(FavoritesContext)
}
