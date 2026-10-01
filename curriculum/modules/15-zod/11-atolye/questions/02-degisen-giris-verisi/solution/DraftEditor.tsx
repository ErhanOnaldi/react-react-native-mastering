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
  dueDate: z
    .string()
    .transform((value) => (value.trim() === '' ? undefined : value))
    .refine((value) => value === undefined || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      error: 'Geçerli bir tarih gir (YYYY-AA-GG) ya da boş bırak',
    }),
})

type DraftInput = z.input<typeof draftSchema>
type DraftOutput = z.output<typeof draftSchema>

export function DraftEditor({
  draft,
  onSave,
}: {
  draft: Draft
  onSave: (values: DraftOutput) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftInput, unknown, DraftOutput>({
    resolver: zodResolver(draftSchema),
    defaultValues: { title: draft.title, dueDate: draft.dueDate },
  })

  return (
    <form onSubmit={handleSubmit((values) => onSave(values))}>
      <label htmlFor="draft-title">Başlık</label>
      <input
        id="draft-title"
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? 'draft-title-error' : undefined}
        {...register('title')}
      />
      {errors.title && (
        <p role="alert" id="draft-title-error">
          {errors.title.message}
        </p>
      )}

      <label htmlFor="draft-due-date">Bitiş tarihi</label>
      <input
        id="draft-due-date"
        placeholder="YYYY-AA-GG"
        aria-invalid={Boolean(errors.dueDate)}
        aria-describedby={errors.dueDate ? 'draft-due-date-error' : undefined}
        {...register('dueDate')}
      />
      {errors.dueDate && (
        <p role="alert" id="draft-due-date-error">
          {errors.dueDate.message}
        </p>
      )}

      <button type="submit">Kaydet</button>
    </form>
  )
}
