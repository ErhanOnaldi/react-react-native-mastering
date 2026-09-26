import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type Movie = { id: number; title: string }
export function GenreDiscover() {
  const [genre, setGenre] = useState('28')
  const result = useQuery({
    queryKey: ['discover'],
    queryFn: async (): Promise<{ results: Movie[] }> => {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genre}&language=tr-TR`,
        { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` } },
      )
      if (!response.ok) throw new Error('Keşif yüklenemedi')
      return response.json()
    },
    staleTime: 60_000,
  })
  return (
    <section>
      <label>
        Tür{' '}
        <select value={genre} onChange={(event) => setGenre(event.target.value)}>
          <option value="28">Aksiyon</option>
          <option value="35">Komedi</option>
        </select>
      </label>
      {result.isPending && <p>Yükleniyor</p>}
      {result.isError && <p role="alert">Keşif yüklenemedi</p>}
      {result.isSuccess && (
        <ul>
          {result.data.results.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
