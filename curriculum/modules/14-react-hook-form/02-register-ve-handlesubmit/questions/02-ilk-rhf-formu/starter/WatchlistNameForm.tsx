export type Watchlist = { id: string; createdAt: string; name: string; description: string }
export type WatchlistValues = Omit<Watchlist, 'id' | 'createdAt'>
export function WatchlistNameForm({ onSave }: { onSave: (values: WatchlistValues) => void }) {
  return (
    <form>
      <label htmlFor="name">Liste adı</label>
      <input id="name" />
      <label htmlFor="description">Açıklama</label>
      <input id="description" />
      <button>Kaydet</button>
    </form>
  )
}
