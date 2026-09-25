import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle aria-hidden className={cn('size-4 animate-spin', className)} />
}

export function PageLoader({ label = 'Yükleniyor…' }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex h-full min-h-40 items-center justify-center gap-2 text-sm text-muted"
    >
      <Spinner /> {label}
    </div>
  )
}
