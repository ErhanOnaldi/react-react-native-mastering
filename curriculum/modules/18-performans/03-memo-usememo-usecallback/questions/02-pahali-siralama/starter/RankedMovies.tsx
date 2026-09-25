export interface Movie {
  id: number
  title: string
  score: number
}
export function RankedMovies({
  movies,
  theme,
  rank,
}: {
  movies: Movie[]
  theme: string
  rank: (items: Movie[]) => Movie[]
}) {
  const result = rank(movies)
  return (
    <section data-theme={theme}>
      <ol>
        {result.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ol>
    </section>
  )
}
