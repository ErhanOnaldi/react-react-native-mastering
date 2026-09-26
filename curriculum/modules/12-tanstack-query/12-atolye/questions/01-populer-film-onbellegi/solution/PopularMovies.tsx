import { useQuery } from '@tanstack/react-query'

type Movie = { id: number; title: string }
export function PopularMovies() {
  const result = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: async (): Promise<{ results: Movie[] }> => {
      const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=tr-TR', {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
      })
      if (!response.ok) throw new Error('Popüler filmler yüklenemedi')
      return response.json()
    },
    staleTime: 60_000,
  })
  if (result.isPending) return <p>Yükleniyor</p>
  if (result.isError) return <p role="alert">Popüler filmler yüklenemedi</p>
  return (
    <ul>
      {result.data.results.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  )
}
