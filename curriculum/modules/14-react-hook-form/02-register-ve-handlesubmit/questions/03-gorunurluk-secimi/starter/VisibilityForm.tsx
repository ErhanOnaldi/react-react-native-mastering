type Watchlist = {
  id: string
  createdAt: string
  name: string
  description: string
  isPublic: boolean
}
export type Values = Omit<Watchlist, 'id' | 'createdAt'>
export function VisibilityForm({ onSave }: { onSave: (values: Values) => void }) {
  return (
    <form>
      <label htmlFor="name">Liste adı</label>
      <input id="name" />
      <label htmlFor="isPublic">Herkese açık</label>
      <input id="isPublic" type="checkbox" />
      <button>Kaydet</button>
    </form>
  )
}
