import type { ComponentProps } from 'react'
import { cn } from './cn'
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-slate-200', className)}
      {...props}
    />
  )
}
export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn('rounded-lg border px-3 py-2 focus-visible:outline-2', className)}
      {...props}
    />
  )
}
