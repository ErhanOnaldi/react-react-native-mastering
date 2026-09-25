import { useQuery } from '@tanstack/react-query'
import { Lightbulb } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Html } from '@/components/ui/html'
import { questionQueries } from './api'

export function HintsPanel({ code, total, used }: { code: string; total: number; used: number }) {
  const [count, setCount] = useState(used)
  const { data } = useQuery({ ...questionQueries.hints(code, count), enabled: count > 0 })

  if (total === 0)
    return (
      <p className="p-5 text-sm text-muted">
        Bu görevde ipucu yok. Testleri okumak en iyi ipucudur.
      </p>
    )

  return (
    <div className="space-y-3 p-5">
      {data?.hints.map((hint, i) => (
        <div key={i} className="rounded-xl border border-warning/30 bg-warning-soft p-4">
          <p className="mb-1 text-xs font-semibold text-warning">İpucu {i + 1}</p>
          <Html html={hint} className="prose-sm" />
        </div>
      ))}
      {count < total ? (
        <Button onClick={() => setCount((c) => c + 1)}>
          <Lightbulb /> {count === 0 ? 'İlk ipucunu göster' : 'Bir sonraki ipucu'} ({count}/{total})
        </Button>
      ) : (
        <p className="text-xs text-muted">Tüm ipuçları açıldı.</p>
      )}
    </div>
  )
}
