import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const schema = z.object({ name: z.string().trim().min(1, { error: 'Ad gerekli' }) })
export function WatchlistForm({ onSave }: { onSave: (name: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  return (
    <form onSubmit={handleSubmit((v) => onSave(v.name))}>
      <label>
        Liste adı
        <input aria-invalid={Boolean(errors.name)} {...register('name')} />
      </label>
      {errors.name && <p role="alert">{errors.name.message}</p>}
      <button>Kaydet</button>
    </form>
  )
}
