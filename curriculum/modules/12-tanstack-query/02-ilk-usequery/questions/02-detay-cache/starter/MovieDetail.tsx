import { useQuery } from '@tanstack/react-query'

async function getMovie(id: number): Promise<{ id: number; title: string }> {
  const response = await fetch('https://api.themoviedb.org/3/movie/' + id, {
    headers: { Authorization: 'Bearer test-token' },
  })
  return response.json()
}

export function MovieDetail({ id }: { id: number }) {
  const movie = useQuery({ queryKey: ['movie', id], queryFn: () => getMovie(id) })
  return <p>Film bekleniyor</p>
}
