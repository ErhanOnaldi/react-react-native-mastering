import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type Rated = { id: number; rating: number; title: string }
const headers = { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }
export function MovieRating() {
  const client = useQueryClient()
  const guest = useQuery({
    queryKey: ['guest-session'],
    queryFn: async (): Promise<string> => {
      const response = await fetch(
        'https://api.themoviedb.org/3/authentication/guest_session/new',
        { headers },
      )
      if (!response.ok) throw new Error('Oturum açılamadı')
      const data = (await response.json()) as { guest_session_id: string }
      return data.guest_session_id
    },
    staleTime: Infinity,
  })
  const session = guest.data
  const key = ['rated-movies', session]
  const rated = useQuery({
    queryKey: key,
    enabled: Boolean(session),
    queryFn: async (): Promise<Rated[]> => {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?language=tr-TR`,
        { headers },
      )
      if (!response.ok) throw new Error('Liste yüklenemedi')
      const data = (await response.json()) as { results: Rated[] }
      return data.results
    },
  })
  const mutation = useMutation({
    mutationFn: async (value: number) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/550/rating?guest_session_id=${session}`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ value }),
        },
      )
      if (!response.ok) throw new Error('Puan kaydedilemedi')
    },
    onMutate: async (value) => {
      await client.cancelQueries({ queryKey: key })
      const previous = client.getQueryData<Rated[]>(key)
      client.setQueryData<Rated[]>(key, (old) => {
        const list = old ?? []
        return list.some((movie) => movie.id === 550)
          ? list.map((movie) => (movie.id === 550 ? { ...movie, rating: value } : movie))
          : [...list, { id: 550, title: 'Dövüş Kulübü', rating: value }]
      })
      return { previous }
    },
    onError: (_error, _value, context) => {
      client.setQueryData(key, context?.previous)
    },
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  })
  const movie = rated.data?.find((item) => item.id === 550)
  return (
    <section>
      {guest.isPending && <p>Oturum açılıyor</p>}
      {guest.isError && <p role="alert">Oturum açılamadı</p>}
      <p>Puan: {movie?.rating ?? 'yok'}</p>
      <button disabled={!session || mutation.isPending} onClick={() => mutation.mutate(7)}>
        7 puan ver
      </button>
      <button disabled={!session || mutation.isPending} onClick={() => mutation.mutate(8.5)}>
        8,5 puan ver
      </button>
      {mutation.isError && <p role="alert">Puan kaydedilemedi</p>}
      <h2>Puanladıklarım</h2>
      {rated.isPending && <p>Liste yükleniyor</p>}
      {rated.isError && <p role="alert">Liste yüklenemedi</p>}
      {rated.isSuccess && (
        <ul>
          {rated.data.map((item) => (
            <li key={item.id}>{item.rating} puan</li>
          ))}
        </ul>
      )}
    </section>
  )
}
