import { useForm } from 'react-hook-form'
type Values = { name: string }
export function ResettableForm({ save }: { save: (v: Values) => Promise<void> }) {
  const { register, handleSubmit } = useForm<Values>({ defaultValues: { name: '' } })
  return (
    <form onSubmit={handleSubmit(save)}>
      <label htmlFor="name">Liste adı</label>
      <input id="name" {...register('name')} />
      <button>Kaydet</button>
    </form>
  )
}
