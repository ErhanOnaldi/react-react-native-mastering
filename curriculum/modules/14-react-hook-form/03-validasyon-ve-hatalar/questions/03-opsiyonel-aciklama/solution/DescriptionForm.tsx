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
      <input id="name" {...register('name', { required: 'Ad gerekli' })} />
      {errors.name && <p role="alert">{errors.name.message}</p>}
      <label htmlFor="description">Açıklama</label>
      <textarea
        id="description"
        {...register('description', {
          maxLength: { value: 120, message: 'Açıklama en çok 120 karakter' },
        })}
      />
      {errors.description && <p role="alert">{errors.description.message}</p>}
      <button type="submit">Kaydet</button>
    </form>
  )
}
