type WatchlistButtonProps = {
  isSaved: boolean
  onToggle: () => void
}

export function WatchlistButton({ isSaved, onToggle }: WatchlistButtonProps) {
  return (
    <button type="button" aria-pressed={isSaved} onClick={onToggle}>
      {isSaved ? 'Listemden çıkar' : 'İzleme listeme ekle'}
    </button>
  )
}
