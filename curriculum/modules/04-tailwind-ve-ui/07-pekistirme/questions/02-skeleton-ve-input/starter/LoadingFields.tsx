import type { ComponentProps } from 'react'
import { cn } from './cn'
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div className={className} {...props} />
}
export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={className} {...props} />
}
