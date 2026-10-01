import { useQuery } from '@tanstack/react-query'

async function getMovie(id: number): Promise<{ id: number; title: string }> {
  const response = await fetch('https://api.themoviedb.org/3/movie/' + id + '?language=tr-TR', {
    headers: { Authorization: 'Bearer test-token' },
  })
  if (!response.ok) throw new Error('Film yüklenemedi')
  return response.json()
}

export function MovieDetail({ id }: { id: number }) {
  const movie = useQuery({
    queryKey: ['movies', 'detail', id],
    queryFn: () => getMovie(id),
  })
  if (movie.isPending) return <p>Yükleniyor</p>
  if (movie.isError) return <p>Hata: {movie.error.message}</p>
  return <h2>{movie.data.title}</h2>
}
