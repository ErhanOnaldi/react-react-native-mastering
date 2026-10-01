import { useForm } from 'react-hook-form'
type Values = { tags: { value: string }[] }
export function TagForm({ onSave }: { onSave: (v: Values) => void }) {
  const { handleSubmit } = useForm<Values>({ defaultValues: { tags: [{ value: '' }] } })
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <label htmlFor="tag-0">Etiket 1</label>
      <input id="tag-0" />
      <button type="button">Etiket ekle</button>
      <button type="submit">Kaydet</button>
    </form>
  )
}
