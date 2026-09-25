import { useForm } from 'react-hook-form'
type Values = { name: string; description: string }
export function DescriptionForm({ onSave }: { onSave: (v: Values) => void }) {
  const { register, handleSubmit } = useForm<Values>()
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <label htmlFor="name">Liste adı</label>
      <input id="name" {...register('name')} />
      <label htmlFor="description">Açıklama</label>
      <textarea id="description" {...register('description')} />
      <button>Kaydet</button>
    </form>
  )
}
