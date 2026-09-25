import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
const schema = z.object({ rating: z.coerce.number() })
export function RatingForm({ onSave }: { onSave: (rating: number) => void }) {
  const { register, handleSubmit } = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({ resolver: zodResolver(schema) })
  return (
    <form onSubmit={handleSubmit((v) => onSave(v.rating))}>
      <label>
        Puan
        <input type="number" {...register('rating')} />
      </label>
      <button>Gönder</button>
    </form>
  )
}
