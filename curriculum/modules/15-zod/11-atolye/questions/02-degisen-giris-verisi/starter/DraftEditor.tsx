import { useForm } from 'react-hook-form'

export interface Draft {
  id: string
  title: string
  /** Boş string "tarih yok" demektir. */
  dueDate: string
}

export function DraftEditor({
  draft,
  onSave,
}: {
  draft: Draft
  onSave: (values: { title: string; dueDate: string | undefined }) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { title: draft.title, dueDate: draft.dueDate },
  })

  return (
    <form onSubmit={handleSubmit((values) => onSave(values))}>
      <label htmlFor="draft-title">Başlık</label>
      <input id="draft-title" {...register('title')} />
      {errors.title && <p role="alert">{errors.title.message}</p>}

      <label htmlFor="draft-due-date">Bitiş tarihi</label>
      <input id="draft-due-date" placeholder="YYYY-AA-GG" {...register('dueDate')} />
      {errors.dueDate && <p role="alert">{errors.dueDate.message}</p>}

      <button type="submit">Kaydet</button>
    </form>
  )
}
