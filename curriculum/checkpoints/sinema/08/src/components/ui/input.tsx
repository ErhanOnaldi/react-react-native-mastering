import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-slate-500 bg-slate-900 px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-brand-400 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
