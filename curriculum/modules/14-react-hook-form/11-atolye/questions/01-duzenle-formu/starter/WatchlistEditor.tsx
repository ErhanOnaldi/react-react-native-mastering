import { useForm } from 'react-hook-form'
import type { WatchlistRecord } from './watchlists'

interface FormValues {
  name: string
  description: string
}

export function WatchlistEditor({
  list,
  onSave,
}: {
  list: WatchlistRecord
  onSave: (values: FormValues) => void
}) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { name: list.name, description: list.description },
  })

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <p>Öne çıkan film: {list.movieTitle}</p>
      <label>
        Liste adı
        <input aria-label="Liste adı" {...register('name')} />
      </label>
      <label>
        Açıklama
        <textarea aria-label="Açıklama" {...register('description')} />
      </label>
      <button type="submit">Kaydet</button>
    </form>
  )
}
