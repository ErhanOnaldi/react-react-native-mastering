interface Props {
  movieId: number
  isFavorite: boolean
  onToggle: (id: number) => void
}
export function FavoriteButton({ movieId, isFavorite, onToggle }: Props) {
  return (
    <button type="button" aria-pressed={isFavorite} onClick={() => onToggle(movieId)}>
      {isFavorite ? 'Favorilere ekle' : 'Favorilere ekle'}
    </button>
  )
}
