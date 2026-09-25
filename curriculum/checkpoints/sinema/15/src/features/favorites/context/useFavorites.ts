import { useContext } from 'react'
import {
  FavoritesContext,
  type FavoritesValue,
} from '@/features/favorites/context/favorites-context'

export function useFavorites(): FavoritesValue {
  const context = useContext(FavoritesContext)
  if (context === null)
    throw new Error('useFavorites, FavoritesProvider içinde kullanılmalı')
  return context
}
