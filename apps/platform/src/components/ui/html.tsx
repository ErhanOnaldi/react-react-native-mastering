import { cn } from '@/lib/cn'

/** Sunucuda üretilmiş (güvenilir, yerel) ders HTML'ini gösterir. */
export function Html({ html, className }: { html: string; className?: string }) {
  return <div className={cn('prose', className)} dangerouslySetInnerHTML={{ __html: html }} />
}
