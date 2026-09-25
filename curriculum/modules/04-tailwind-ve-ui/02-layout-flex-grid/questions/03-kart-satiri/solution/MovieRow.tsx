export function MovieRow({ title, score }: { title: string; score: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="min-w-0 truncate">{title}</h2>
      <span className="shrink-0">{score}</span>
    </div>
  )
}
