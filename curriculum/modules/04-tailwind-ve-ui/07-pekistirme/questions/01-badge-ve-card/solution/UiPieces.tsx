import type { ComponentProps } from 'react'
import { cn } from './cn'
export function Badge({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('rounded-full bg-sky-100 px-2', className)} {...props}>
      {children}
    </span>
  )
}
export function Card({ children, className, ...props }: ComponentProps<'article'>) {
  return (
    <article className={cn('rounded-xl border p-4', className)} {...props}>
      {children}
    </article>
  )
}
