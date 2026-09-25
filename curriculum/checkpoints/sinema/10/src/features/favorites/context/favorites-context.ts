import { createContext } from 'react'

export interface FavoritesValue {
  favoriteIds: number[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
}

export const FavoritesContext = createContext<FavoritesValue | null>(null)
