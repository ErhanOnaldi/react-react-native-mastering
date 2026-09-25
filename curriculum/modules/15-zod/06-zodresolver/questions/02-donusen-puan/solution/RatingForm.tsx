import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
const schema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, { error: 'Puan 1–5 olmalı' })
    .max(5, { error: 'Puan 1–5 olmalı' }),
})
export function RatingForm({ onSave }: { onSave: (rating: number) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
  })
  return (
    <form onSubmit={handleSubmit((v) => onSave(v.rating))}>
      <label>
        Puan
        <input type="number" aria-invalid={Boolean(errors.rating)} {...register('rating')} />
      </label>
      {errors.rating && <p role="alert">{errors.rating.message}</p>}
      <button>Gönder</button>
    </form>
  )
}
