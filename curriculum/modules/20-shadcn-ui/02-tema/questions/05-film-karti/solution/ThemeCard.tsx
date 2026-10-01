import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ThemeCardProps {
  title: string
  year: number
  rating: number
  overview: string
  className?: string
}

export function ThemeCard({ title, year, rating, overview, className }: ThemeCardProps) {
  const classes = twMerge(clsx('rounded-lg bg-card p-4 text-card-foreground', className))

  return (
    <article className={classes}>
      <header>
        <h2>{title}</h2>
        <p>{year}</p>
      </header>
      <p>{rating}</p>
      <p>{overview}</p>
    </article>
  )
}
