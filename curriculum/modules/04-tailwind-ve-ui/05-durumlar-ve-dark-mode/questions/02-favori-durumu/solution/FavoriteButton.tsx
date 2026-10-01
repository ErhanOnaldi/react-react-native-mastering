type Props = { active: boolean; disabled?: boolean; onClick?: () => void }
export function FavoriteButton({ active, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg bg-sky-700 px-3 py-2 text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-sky-500 disabled:opacity-50 dark:bg-sky-500"
    >
      {active ? 'Favorilerden çıkar' : 'Favoriye ekle'}
    </button>
  )
}
