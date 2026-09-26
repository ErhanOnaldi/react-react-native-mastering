interface Props {
  isFavorite: boolean
  onToggle: () => void
}

export function FavoriteButton({ isFavorite, onToggle }: Props) {
  return (
    <button type="button" aria-label="Favori" aria-pressed={isFavorite} onClick={onToggle}>
      <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
    </button>
  )
}
