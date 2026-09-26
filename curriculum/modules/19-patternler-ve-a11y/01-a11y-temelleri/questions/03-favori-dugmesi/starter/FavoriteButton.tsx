interface Props {
  isFavorite: boolean
  onToggle: () => void
}

export function FavoriteButton({ isFavorite, onToggle }: Props) {
  return (
    <button type="button" onClick={onToggle}>
      {isFavorite ? '★' : '☆'}
    </button>
  )
}
