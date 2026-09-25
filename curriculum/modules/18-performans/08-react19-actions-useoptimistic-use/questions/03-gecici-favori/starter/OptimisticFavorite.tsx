export function OptimisticFavorite({
  initial,
  save,
}: {
  initial: boolean
  save: (next: boolean) => Promise<void>
}) {
  return <button type="button">{initial ? 'Favorilerden çıkar' : 'Favorilere ekle'}</button>
}
