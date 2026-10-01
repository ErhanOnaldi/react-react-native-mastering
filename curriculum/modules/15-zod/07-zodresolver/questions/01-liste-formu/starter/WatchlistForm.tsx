import { useForm } from 'react-hook-form'
export function WatchlistForm({ onSave }: { onSave: (name: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  return (
    <form onSubmit={handleSubmit((v) => onSave(v.name))}>
      <label>
        Liste adı
        <input {...register('name')} />
      </label>
      {errors.name && <p role="alert">{String(errors.name.message)}</p>}
      <button>Kaydet</button>
    </form>
  )
}
