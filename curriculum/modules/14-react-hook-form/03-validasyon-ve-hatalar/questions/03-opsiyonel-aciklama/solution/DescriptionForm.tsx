import { useForm } from 'react-hook-form'
type Values = { name: string; description: string }
export function DescriptionForm({ onSave }: { onSave: (v: Values) => void }) {
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
        {...register('name', { required: 'Ad gerekli' })}
      />
      {errors.name && (
        <p id="name-error" role="alert">
          {errors.name.message}
        </p>
      )}
      <label htmlFor="description">Açıklama</label>
      <textarea
        id="description"
        aria-invalid={errors.description ? true : undefined}
        aria-describedby={errors.description ? 'description-error' : undefined}
        {...register('description', {
          maxLength: { value: 120, message: 'Açıklama en çok 120 karakter' },
        })}
      />
      {errors.description && (
        <p id="description-error" role="alert">
          {errors.description.message}
        </p>
      )}
      <button type="submit">Kaydet</button>
    </form>
  )
}
