import { useFieldArray, useForm } from 'react-hook-form'
type Values = { tags: { value: string }[] }
export function TagForm({ onSave }: { onSave: (v: Values) => void }) {
  const { register, control, handleSubmit } = useForm<Values>({
    defaultValues: { tags: [{ value: '' }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'tags' })
  return (
    <form onSubmit={handleSubmit(onSave)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <label htmlFor={`tag-${field.id}`}>Etiket {index + 1}</label>
          <input id={`tag-${field.id}`} {...register(`tags.${index}.value`)} />
          <button
            type="button"
            aria-label={`Etiket ${index + 1} sil`}
            onClick={() => remove(index)}
          >
            Sil
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ value: '' })}>
        Etiket ekle
      </button>
      <button type="submit">Kaydet</button>
    </form>
  )
}
