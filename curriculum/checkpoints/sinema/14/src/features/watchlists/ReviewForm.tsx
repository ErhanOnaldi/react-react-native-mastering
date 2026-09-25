import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/button'

interface ReviewValues {
  body: string
  rating: number
}

export function ReviewForm({ postId }: { postId: number }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewValues>({ defaultValues: { body: '', rating: 0 } })

  const mutation = useMutation({
    mutationFn: async ({ body }: ReviewValues) => {
      const response = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, postId, userId: 1 }),
      })
      if (!response.ok)
        throw new Error(`Yorum gönderilemedi (${response.status}).`)
      return response.json()
    },
    onSuccess: () => reset(),
  })

  return (
    <form
      className="space-y-3"
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <Controller
        name="rating"
        control={control}
        rules={{ min: { value: 1, message: 'Puan seç' } }}
        render={({ field }) => (
          <fieldset
            aria-invalid={!!errors.rating}
            aria-describedby={errors.rating ? 'review-rating-error' : undefined}
          >
            <legend>Puan</legend>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  aria-label={`${score} yıldız`}
                  aria-pressed={field.value === score}
                  onClick={() => field.onChange(score)}
                  className="rounded border border-slate-500 px-3 py-1 focus-visible:outline-2"
                >
                  {score} ★
                </button>
              ))}
            </div>
            {errors.rating && (
              <p id="review-rating-error" role="alert">
                {errors.rating.message}
              </p>
            )}
          </fieldset>
        )}
      />
      <div>
        <label htmlFor="review-body">Yorum</label>
        <textarea
          id="review-body"
          className="w-full rounded-lg border border-slate-500 bg-slate-900 px-3 py-2"
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? 'review-body-error' : undefined}
          {...register('body', {
            validate: (value) => !!value.trim() || 'Yorum gerekli',
          })}
        />
        {errors.body && (
          <p id="review-body-error" role="alert">
            {errors.body.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Gönderiliyor…' : 'Gönder'}
      </Button>
      {mutation.isSuccess && <p role="status">Yorum kaydedildi</p>}
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
    </form>
  )
}
