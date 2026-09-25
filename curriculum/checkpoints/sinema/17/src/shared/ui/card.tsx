import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

export function Card({ className, ...props }: ComponentProps<'article'>) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-xl border border-slate-700 bg-slate-900',
        className,
      )}
      {...props}
    />
  )
}
