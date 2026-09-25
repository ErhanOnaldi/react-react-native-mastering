import { useAppDispatch, useAppSelector } from '@/app/store'
import { toggleFavorite as toggleFavoriteAction } from '../store/favoritesSlice'

/** Önceki modüllerin çağrı biçimi için Redux uyumluluk katmanı. */
export function useFavorites() {
  const favoriteIds = useAppSelector((state) => state.favorites.ids)
  const dispatch = useAppDispatch()
  return {
    favoriteIds,
    isFavorite: (id: number) => favoriteIds.includes(id),
    toggleFavorite: (id: number) => dispatch(toggleFavoriteAction(id)),
  }
}
