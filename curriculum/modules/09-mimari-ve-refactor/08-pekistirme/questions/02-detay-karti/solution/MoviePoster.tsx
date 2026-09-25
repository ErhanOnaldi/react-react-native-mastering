export function MoviePoster({ title, path }: { title: string; path: string | null }) {
  if (!path) return null
  return <img src={`https://image.tmdb.org/t/p/w185${path}`} alt={title} />
}
