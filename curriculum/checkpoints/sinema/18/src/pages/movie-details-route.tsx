import { queryClient } from '@/shared/api/query-client'
import { movieQueries } from '@/features/movies/api/movie-queries'
import { MovieDetailsPage } from './MovieDetailsPage'

export const Component = MovieDetailsPage

export async function loader({ params }: { params: { id?: string } }) {
  const id = params.id
  const movieId = id && /^[1-9]\d*$/.test(id) ? Number(id) : NaN
  if (!Number.isSafeInteger(movieId)) throw new Error('Geçersiz film adresi.')
  return queryClient.ensureQueryData(movieQueries.detail(movieId))
}
