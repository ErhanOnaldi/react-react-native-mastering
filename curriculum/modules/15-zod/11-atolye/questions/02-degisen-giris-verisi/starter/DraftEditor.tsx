import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export interface Draft {
  id: string
  title: string
  /** Boş string "tarih yok" demektir. */
  dueDate: string
}

const draftSchema = z.object({
  title: z.string().trim().min(1, { error: 'Başlık gerekli' }),
  dueDate: z.string().optional(),
})

type DraftValues = z.infer<typeof draftSchema>

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
  } = useForm<DraftValues>({
    resolver: zodResolver(draftSchema),
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
