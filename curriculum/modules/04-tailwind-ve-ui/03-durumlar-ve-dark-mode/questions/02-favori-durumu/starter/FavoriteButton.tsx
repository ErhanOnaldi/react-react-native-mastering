type Props = { active: boolean; disabled?: boolean; onClick?: () => void }
export function FavoriteButton({ active, disabled, onClick }: Props) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {active ? 'Favorilerden çıkar' : 'Favoriye ekle'}
    </button>
  )
}
