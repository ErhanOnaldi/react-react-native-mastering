import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { getGuestSession } from '@/features/rating/api/rating-api'
import { ratedMoviesQuery } from '@/features/rating/api/rating-queries'

export default function RatedPage() {
  const session = useQuery({
    queryKey: ['guest-session'],
    queryFn: getGuestSession,
  })
  if (session.isPending) return <p role="status">Oturum açılıyor…</p>
  if (session.isError)
    return <p role="alert">Oturum açılamadı: {session.error.message}</p>
  return <RatedList sessionId={session.data} />
}

function RatedList({ sessionId }: { sessionId: string }) {
  const rated = useQuery(ratedMoviesQuery(sessionId))
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Puanladıklarım</h2>
      {rated.isPending ? (
        <p role="status">Puanlanan filmler yükleniyor…</p>
      ) : rated.isError ? (
        <p role="alert">Puanlanan filmler alınamadı: {rated.error.message}</p>
      ) : rated.data.results.length === 0 ? (
        <p>Henüz film puanlamadın.</p>
      ) : (
        <ul className="space-y-2">
          {rated.data.results.map((movie) => (
            <li key={movie.id}>
              <Link className="underline" to={`/movie/${movie.id}`}>
                {movie.title}
              </Link>{' '}
              — {movie.rating.toLocaleString('tr-TR')} / 10
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
