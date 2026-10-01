export interface ThemeCardProps {
  title: string
  year: number
  rating: number
  overview: string
  className?: string
}

export function ThemeCard(props: ThemeCardProps) {
  return (
    <article>
      <h2>{props.title}</h2>
      <p>{props.year}</p>
    </article>
  )
}
