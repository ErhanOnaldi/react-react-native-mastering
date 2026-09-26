import { useAppDispatch, useAppSelector } from '@/app/store'
import { toggleFavorite } from '@/features/favorites/store/favoritesSlice'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDownIcon } from '@/components/ui/icons'

export function MovieActionsMenu({ movieId }: { movieId: number }) {
  const isFavorite = useAppSelector((state) =>
    state.favorites.ids.includes(movieId),
  )
  const dispatch = useAppDispatch()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          Film işlemleri
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {/* Aç/kapa bir tercih: menüde doğru rol menuitemcheckbox + aria-checked. */}
        <DropdownMenuCheckboxItem
          checked={isFavorite}
          onCheckedChange={() => dispatch(toggleFavorite(movieId))}
        >
          Favori
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={`https://www.themoviedb.org/movie/${movieId}`}
            target="_blank"
            rel="noreferrer"
          >
            TMDB'de aç
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
