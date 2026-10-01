import { useForm } from 'react-hook-form'
type Values = { name: string }
export function ResettableForm({ save }: { save: (v: Values) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<Values>({ defaultValues: { name: '' } })
  async function submit(values: Values) {
    try {
      await save(values)
      reset()
    } catch {
      /* Girdi korunur; üst katman hatayı gösterebilir. */
    }
  }
  return (
    <form onSubmit={handleSubmit(submit)}>
      <label htmlFor="name">Liste adı</label>
      <input id="name" {...register('name')} />
      <button type="submit" disabled={!isDirty || isSubmitting}>
        {isSubmitting ? 'Kaydediliyor…' : 'Kaydet'}
      </button>
    </form>
  )
}
