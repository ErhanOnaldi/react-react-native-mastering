import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

interface Movie {
  id: number
  title: string
}

const GENRES = [
  { id: '28', label: 'Aksiyon' },
  { id: '35', label: 'Komedi' },
] as const

const headers = { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }

async function fetchGenreMovies(genreId: string, signal: AbortSignal): Promise<Movie[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=tr-TR`,
    { headers, signal },
  )
  if (!response.ok) throw new Error('Filmler yüklenemedi')
  const data = (await response.json()) as { results: Movie[] }
  return data.results
}

async function fetchGuestSession(): Promise<string> {
  const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
    headers,
  })
  const data = (await response.json()) as { guest_session_id: string }
  return data.guest_session_id
}

async function fetchRatedMovies(sessionId: string): Promise<Movie[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?language=tr-TR`,
    { headers },
  )
  if (!response.ok) throw new Error('Liste yüklenemedi')
  const data = (await response.json()) as { results: Movie[] }
  return data.results
}

async function rateMovie(sessionId: string, movieId: number): Promise<void> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}`,
    {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: 8 }),
    },
  )
  if (!response.ok) throw new Error('Puan kaydedilemedi')
}

export function GenreBoard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const genreId = searchParams.get('genre') ?? GENRES[0].id
  const queryClient = useQueryClient()

  const guest = useQuery({
    queryKey: ['guest-session'],
    queryFn: fetchGuestSession,
    staleTime: Infinity,
  })
  const sessionId = guest.data

  const discover = useQuery({
    queryKey: ['discover-movie', genreId],
    queryFn: ({ signal }) => fetchGenreMovies(genreId, signal),
  })

  const ratedKey = ['rated-movies', sessionId]
  const rated = useQuery({
    queryKey: ratedKey,
    queryFn: () => fetchRatedMovies(sessionId as string),
    enabled: Boolean(sessionId),
  })

  const mutation = useMutation({
    mutationFn: (movieId: number) => rateMovie(sessionId as string, movieId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ratedKey })
    },
  })

  return (
    <div>
      <section aria-label="Keşfet">
        <nav>
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              aria-pressed={genre.id === genreId}
              onClick={() => setSearchParams({ genre: genre.id })}
            >
              {genre.label}
            </button>
          ))}
        </nav>
        {discover.isPending && <p>Yükleniyor</p>}
        {discover.isError && <p role="alert">Filmler yüklenemedi</p>}
        {discover.isSuccess && (
          <ul>
            {discover.data.map((movie) => (
              <li key={movie.id}>
                {movie.title}{' '}
                <button
                  aria-label={`${movie.title} puanla`}
                  disabled={!sessionId}
                  onClick={() => mutation.mutate(movie.id)}
                >
                  Puanla
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section aria-label="Puanladıklarım">
        <h2>Puanladıklarım</h2>
        {rated.isSuccess && (
          <ul>
            {rated.data.map((movie) => (
              <li key={movie.id}>{movie.title}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
