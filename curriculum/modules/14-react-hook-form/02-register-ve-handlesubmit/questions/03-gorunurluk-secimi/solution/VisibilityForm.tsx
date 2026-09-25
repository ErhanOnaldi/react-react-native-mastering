import { useForm } from 'react-hook-form'
type Watchlist = {
  id: string
  createdAt: string
  name: string
  description: string
  isPublic: boolean
}
export type Values = Omit<Watchlist, 'id' | 'createdAt'>
export function VisibilityForm({ onSave }: { onSave: (values: Values) => void }) {
  const { register, handleSubmit } = useForm<Values>({
    defaultValues: { name: '', description: '', isPublic: false },
  })
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <label htmlFor="name">Liste adı</label>
      <input id="name" {...register('name')} />
      <label htmlFor="isPublic">Herkese açık</label>
      <input id="isPublic" type="checkbox" {...register('isPublic')} />
      <button type="submit">Kaydet</button>
    </form>
  )
}
