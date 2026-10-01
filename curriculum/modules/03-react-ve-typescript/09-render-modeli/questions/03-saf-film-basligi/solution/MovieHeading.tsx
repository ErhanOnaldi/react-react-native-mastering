export function MovieHeading({ title, year }: { title: string; year: string }) {
  return (
    <div>
      <h2>{title}</h2>
      {year && <span>{year}</span>}
    </div>
  )
}
