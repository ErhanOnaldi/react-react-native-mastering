import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-slate-700', className)}
    />
  )
}
