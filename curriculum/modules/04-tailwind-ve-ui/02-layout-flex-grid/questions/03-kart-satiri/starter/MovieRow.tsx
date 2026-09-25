export function MovieRow({ title, score }: { title: string; score: string }) {
  return (
    <div>
      <h2>{title}</h2>
      <span>{score}</span>
    </div>
  )
}
