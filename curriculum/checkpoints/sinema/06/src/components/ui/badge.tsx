import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'bg-brand-900 text-brand-100 inline-flex rounded-full px-2 py-1 text-xs',
        className,
      )}
      {...props}
    />
  )
}
