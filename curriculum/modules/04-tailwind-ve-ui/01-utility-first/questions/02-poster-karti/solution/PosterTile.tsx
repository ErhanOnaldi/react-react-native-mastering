export function PosterTile({ title, score }: { title: string; score: string }) {
  return (
    <article className="rounded-xl border p-4">
      <h2 className="font-semibold">{title}</h2>
      <span className="text-sm">{score}</span>
    </article>
  )
}
