export function PosterTile({ title, score }: { title: string; score: string }) {
  return (
    <article>
      <h2>{title}</h2>
      <span>{score}</span>
    </article>
  )
}
