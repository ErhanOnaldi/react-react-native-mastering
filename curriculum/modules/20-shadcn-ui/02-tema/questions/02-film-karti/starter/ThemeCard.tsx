export interface ThemeCardProps {
  title: string
  className?: string
}

export function ThemeCard({ title, className }: ThemeCardProps) {
  return <article className={className}><h2>{title}</h2></article>
}
