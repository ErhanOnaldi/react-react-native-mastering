type WatchlistButtonProps = {
  isSaved: boolean
  onToggle: () => void
}

export function WatchlistButton(_props: WatchlistButtonProps) {
  return <button type="button">İzleme listeme ekle</button>
}
