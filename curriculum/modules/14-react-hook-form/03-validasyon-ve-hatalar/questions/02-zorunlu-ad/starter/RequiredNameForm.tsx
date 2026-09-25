import { useForm } from 'react-hook-form'
export type Values = { name: string }
export function RequiredNameForm({ onSave }: { onSave: (values: Values) => void }) {
  const { register, handleSubmit } = useForm<Values>()
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <label htmlFor="name">Liste adı</label>
      <input id="name" {...register('name')} />
      <button>Kaydet</button>
    </form>
  )
}
