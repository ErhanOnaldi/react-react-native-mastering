import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const schema = z.object({ name: z.string() })
export function WatchlistForm({ onSave }: { onSave: (name: string) => void }) {
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  return (
    <form onSubmit={handleSubmit((v) => onSave(v.name))}>
      <label>
        Liste adı
        <input {...register('name')} />
      </label>
      <button>Kaydet</button>
    </form>
  )
}
