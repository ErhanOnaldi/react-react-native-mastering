import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full bg-brand-900 px-2 py-1 text-xs text-brand-100',
        className,
      )}
      {...props}
    />
  )
}
