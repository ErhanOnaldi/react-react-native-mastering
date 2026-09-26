import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
  readingFormSchema,
  readingStatuses,
  statusLabels,
  type ReadingEntry,
  type ReadingFormInput,
  type ReadingFormOutput,
} from './schemas'
import { useReadingList } from './useReadingList'

export interface ReadingListBook {
  workId: string
  title: string
  authors: string[]
  coverId: number | null
}

function toFormValues(entry: ReadingEntry | undefined): ReadingFormInput {
  if (!entry) return { status: 'want', rating: '', note: '' }
  return {
    status: entry.status,
    rating: entry.rating === null ? '' : (String(entry.rating) as ReadingFormInput['rating']),
    note: entry.note,
  }
}

export function ReadingListForm({ book }: { book: ReadingListBook }) {
  const { getEntry, upsert, remove } = useReadingList()
  const existing = getEntry(book.workId)
  const [message, setMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReadingFormInput, unknown, ReadingFormOutput>({
    resolver: zodResolver(readingFormSchema),
    defaultValues: toFormValues(existing),
  })
  const status = useWatch({ control, name: 'status' })

  function onSubmit(values: ReadingFormOutput) {
    const entry: ReadingEntry = { ...book, ...values, updatedAt: new Date().toISOString() }
    upsert(entry)
    reset(toFormValues(entry))
    setMessage(existing ? 'Okuma listen güncellendi.' : 'Okuma listene eklendi.')
  }

  function onRemove() {
    remove(book.workId)
    reset(toFormValues(undefined))
    setMessage('Okuma listenden çıkarıldı.')
  }

  return (
    <form
      aria-label="Okuma listesi"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-lg border border-stone-200 bg-white p-4"
    >
      <h2 className="font-serif text-xl font-semibold">
        {existing ? 'Okuma listende' : 'Okuma listeme ekle'}
      </h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="reading-status" className="text-sm font-medium">
          Durum
        </label>
        <select
          id="reading-status"
          {...register('status')}
          className="rounded-md border border-stone-300 px-2 py-1.5"
        >
          {readingStatuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {status === 'read' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="reading-rating" className="text-sm font-medium">
            Puan
          </label>
          <select
            id="reading-rating"
            {...register('rating')}
            aria-invalid={errors.rating ? true : undefined}
            aria-describedby={errors.rating ? 'reading-rating-error' : undefined}
            className="rounded-md border border-stone-300 px-2 py-1.5"
          >
            <option value="">Seç</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
          {errors.rating && (
            <p id="reading-rating-error" role="alert" className="text-sm text-red-700">
              {errors.rating.message}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="reading-note" className="text-sm font-medium">
          Not
        </label>
        <textarea
          id="reading-note"
          rows={3}
          {...register('note')}
          aria-invalid={errors.note ? true : undefined}
          aria-describedby={errors.note ? 'reading-note-error' : undefined}
          className="rounded-md border border-stone-300 px-2 py-1.5"
        />
        {errors.note && (
          <p id="reading-note-error" role="alert" className="text-sm text-red-700">
            {errors.note.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-ink px-4 py-2 font-medium text-paper hover:bg-stone-700"
        >
          {existing ? 'Güncelle' : 'Listeye ekle'}
        </button>
        {existing && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md border border-stone-300 px-4 py-2 hover:border-red-400"
          >
            Listeden çıkar
          </button>
        )}
      </div>
      {message && (
        <p role="status" className="text-sm text-green-700">
          {message}
        </p>
      )}
    </form>
  )
}
