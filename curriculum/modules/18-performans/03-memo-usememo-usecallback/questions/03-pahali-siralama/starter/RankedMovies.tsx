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
  // Sıralı sonuçları ve numaralı film listesini oluştur.
  return <section data-theme={theme} />
}
