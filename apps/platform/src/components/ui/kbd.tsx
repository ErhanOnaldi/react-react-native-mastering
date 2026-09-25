import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'rounded border border-border-strong bg-surface-3 px-1 font-mono text-[10px] text-muted',
        className,
      )}
      {...props}
    />
  )
}
