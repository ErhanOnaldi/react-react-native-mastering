import { useForm } from 'react-hook-form'
type Values = { name: string }
export function AccessibleNameForm({ onSave }: { onSave: (v: Values) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>()
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <label htmlFor="watchlist-name">Liste adı</label>
      <input
        id="watchlist-name"
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? 'watchlist-name-error' : undefined}
        {...register('name', { required: 'Ad gerekli' })}
      />
      {errors.name && (
        <p id="watchlist-name-error" role="alert">
          {errors.name.message}
        </p>
      )}
      <button type="submit">Kaydet</button>
    </form>
  )
}
