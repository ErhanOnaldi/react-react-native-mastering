import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { watchlistSchema } from './schemas'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import type { WatchlistValues } from './types'
import { useWatchlists } from './useWatchlists'

const defaults: WatchlistValues = {
  name: '',
  description: '',
  isPublic: false,
  tags: [{ value: '' }],
}

export function WatchlistForm() {
  const { addWatchlist } = useWatchlists()
  const [saved, setSaved] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WatchlistValues>({
    defaultValues: defaults,
    resolver: zodResolver(watchlistSchema),
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'tags' })

  const onSubmit = handleSubmit((values) => {
    addWatchlist({
      ...values,
      name: values.name.trim(),
      tags: values.tags
        .map(({ value }) => ({ value: value.trim() }))
        .filter(({ value }) => value),
    })
    setSaved(true)
    reset()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="watchlist-name">Liste adı</label>
        <Input
          id="watchlist-name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'watchlist-name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="watchlist-name-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="watchlist-description">Açıklama</label>
        <textarea
          id="watchlist-description"
          className="w-full rounded-lg border border-slate-500 bg-slate-900 px-3 py-2"
          {...register('description')}
        />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('isPublic')} />
        Herkese açık
      </label>
      <fieldset className="space-y-2">
        <legend>Etiketler</legend>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div>
              <label htmlFor={`watchlist-tag-${field.id}`}>
                Etiket {index + 1}
              </label>
              <Input
                id={`watchlist-tag-${field.id}`}
                {...register(`tags.${index}.value`)}
              />
            </div>
            <Button variant="secondary" onClick={() => remove(index)}>
              Etiket {index + 1} sil
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={() => append({ value: '' })}>
          Etiket ekle
        </Button>
      </fieldset>
      <Button type="submit" disabled={isSubmitting}>
        Kaydet
      </Button>
      {saved && <p role="status">Liste kaydedildi</p>}
    </form>
  )
}
