import { useMemo } from 'react'
export interface Movie {
  id: number
  title: string
  score: number
}
export interface RankedMoviesProps {
  movies: Movie[]
  theme: string
  rank: (items: Movie[]) => Movie[]
}

export function RankedMovies({ movies, theme, rank }: RankedMoviesProps) {
  const result = useMemo(() => rank([...movies]), [movies, rank])
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
