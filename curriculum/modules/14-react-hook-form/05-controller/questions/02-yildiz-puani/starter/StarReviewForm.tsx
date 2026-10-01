import { useForm } from 'react-hook-form'
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
  const { register, handleSubmit } = useForm<Values>({ defaultValues: { rating: 0, body: '' } })
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <RatingStars value={0} onChange={() => {}} />
      <label htmlFor="body">Yorum</label>
      <textarea id="body" {...register('body')} />
      <button>Gönder</button>
    </form>
  )
}
