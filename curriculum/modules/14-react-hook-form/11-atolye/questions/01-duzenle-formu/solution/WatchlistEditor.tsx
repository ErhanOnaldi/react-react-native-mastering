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
  return <WatchlistEditorForm key={list.id} list={list} onSave={onSave} />
}

function WatchlistEditorForm({
  list,
  onSave,
}: {
  list: WatchlistRecord
  onSave: (values: FormValues) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: { name: list.name, description: list.description },
  })

  function submit(values: FormValues) {
    onSave(values)
    reset(values)
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <p>Öne çıkan film: {list.movieTitle}</p>
      <label>
        Liste adı
        <input aria-label="Liste adı" {...register('name')} />
      </label>
      <label>
        Açıklama
        <textarea aria-label="Açıklama" {...register('description')} />
      </label>
      <button type="submit" disabled={!isDirty}>
        Kaydet
      </button>
    </form>
  )
}
