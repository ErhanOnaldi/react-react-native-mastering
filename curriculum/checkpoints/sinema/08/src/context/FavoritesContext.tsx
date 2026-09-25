import type { ReactNode } from 'react'
import { FavoritesContext, type FavoritesValue } from './favorites-context'
import { useLocalStorage } from '../hooks/useLocalStorage'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<number[]>(
    'sinema-favorites',
    [],
  )

  function toggleFavorite(id: number) {
    setFavoriteIds((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    )
  }

  const value: FavoritesValue = {
    favoriteIds,
    isFavorite: (id) => favoriteIds.includes(id),
    toggleFavorite,
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
