import { useParams } from 'react-router'

export interface Film {
  id: number
  title: string
}
export function MovieDetails({ movies }: { movies: Film[] }) {
  const { id } = useParams<'id'>()
  if (!id || !/^\d+$/.test(id)) return <p>Geçersiz film adresi</p>
  const movieId = Number(id)
  if (!Number.isSafeInteger(movieId) || movieId < 1) return <p>Geçersiz film adresi</p>
  const movie = movies.find((item) => item.id === movieId)
  if (!movie) return <p>Film bulunamadı</p>
  return <h1>{movie.title}</h1>
}
