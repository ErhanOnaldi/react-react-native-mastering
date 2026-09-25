import { Controller, useForm } from 'react-hook-form'
type Values = { rating: number; body: string }
function RatingStars({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div role="group" aria-label="Puan">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          aria-label={`${n} yıldız`}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
export function StarReviewForm({ onSave }: { onSave: (v: Values) => void }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values>({ defaultValues: { rating: 0, body: '' } })
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Controller
        control={control}
        name="rating"
        rules={{ min: { value: 1, message: 'Puan seç' } }}
        render={({ field }) => <RatingStars value={field.value} onChange={field.onChange} />}
      />
      {errors.rating && <p role="alert">{errors.rating.message}</p>}
      <label htmlFor="body">Yorum</label>
      <textarea id="body" {...register('body')} />
      <button type="submit">Gönder</button>
    </form>
  )
}
