import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ThemeCardProps {
  title: string
  className?: string
}

export function ThemeCard({ title, className }: ThemeCardProps) {
  return <article className={twMerge(clsx('rounded-lg bg-card text-card-foreground', className))}><h2>{title}</h2></article>
}
