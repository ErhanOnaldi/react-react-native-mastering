import { coverUrl, type CoverSize } from '../api/covers'
import { cn } from '@/shared/lib/cn'

interface BookCoverProps {
  coverId: number | null
  title: string
  size?: CoverSize
  className?: string
}

/** Kapak yoksa kırık görsel yerine sade bir yer tutucu gösterir. */
export function BookCover({ coverId, title, size = 'M', className }: BookCoverProps) {
  const src = coverUrl(coverId, size)
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'flex items-center justify-center rounded bg-stone-200 p-2 text-center text-xs text-stone-500',
          className,
        )}
      >
        Kapak yok
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={`${title} kapağı`}
      loading="lazy"
      className={cn('rounded bg-stone-200 object-cover shadow-sm', className)}
    />
  )
}
