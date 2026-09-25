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
      <input {...register('name', { required: 'Ad gerekli' })} />
      {errors.name && <p role="alert">{errors.name.message}</p>}
      <button>Kaydet</button>
    </form>
  )
}
