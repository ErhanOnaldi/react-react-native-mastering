import { useForm } from 'react-hook-form'
export type Watchlist = { id: string; createdAt: string; name: string; description: string }
export type WatchlistValues = Omit<Watchlist, 'id' | 'createdAt'>
export function WatchlistNameForm({ onSave }: { onSave: (values: WatchlistValues) => void }) {
  const { register, handleSubmit } = useForm<WatchlistValues>()
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <label htmlFor="name">Liste adı</label>
      <input id="name" {...register('name')} />
      <label htmlFor="description">Açıklama</label>
      <input id="description" {...register('description')} />
      <button type="submit">Kaydet</button>
    </form>
  )
}
