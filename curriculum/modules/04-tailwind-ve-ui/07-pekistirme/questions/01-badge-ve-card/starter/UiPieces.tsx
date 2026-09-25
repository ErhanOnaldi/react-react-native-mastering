import type { ComponentProps } from 'react'
import { cn } from './cn'
export function Badge({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}
export function Card({ children, className, ...props }: ComponentProps<'article'>) {
  return (
    <article className={className} {...props}>
      {children}
    </article>
  )
}
