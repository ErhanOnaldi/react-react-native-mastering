import { useParams } from 'react-router'

export interface Film {
  id: number
  title: string
}
export function MovieDetails({ movies }: { movies: Film[] }) {
  const { id } = useParams<'id'>()
  return <h1>Film</h1>
}
