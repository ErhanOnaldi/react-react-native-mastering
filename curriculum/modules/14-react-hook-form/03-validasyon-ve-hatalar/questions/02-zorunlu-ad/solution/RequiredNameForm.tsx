import { useForm } from 'react-hook-form'
export type Values = { name: string }
export function RequiredNameForm({ onSave }: { onSave: (values: Values) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>()
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <label htmlFor="name">Liste adı</label>
      <input
        id="name"
        aria-invalid={errors.name ? true : undefined}
        aria-describedby={errors.name ? 'name-error' : undefined}
        {...register('name', {
          required: 'Ad gerekli',
          minLength: { value: 3, message: 'En az 3 karakter' },
        })}
      />
      {errors.name && (
        <p id="name-error" role="alert">
          {errors.name.message}
        </p>
      )}
      <button type="submit">Kaydet</button>
    </form>
  )
}
