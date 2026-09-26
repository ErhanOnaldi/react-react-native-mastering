import { useEffect, useState } from 'react'

type Movie = { id: number; title: string }
export function MoviePages() {
  const [page, setPage] = useState<'popular' | 'search'>('popular')
  const [movies, setMovies] = useState<Movie[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/popular?language=tr-TR', {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error()
        return response.json() as Promise<{ results: Movie[] }>
      })
      .then((data) => {
        setMovies(data.results)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])
  return (
    <main>
      <nav>
        <button onClick={() => setPage('popular')}>Popüler</button>
        <button onClick={() => setPage('search')}>Arama</button>
      </nav>
      {page === 'popular' ? (
        <section>
          {status === 'loading' && <p>Yükleniyor</p>}
          {status === 'error' && <p role="alert">Filmler yüklenemedi</p>}
          {status === 'success' &&
            (movies.length ? (
              <ul>
                {movies.map((movie) => (
                  <li key={movie.id}>{movie.title}</li>
                ))}
              </ul>
            ) : (
              <p>Film bulunamadı</p>
            ))}
        </section>
      ) : (
        <p>Arama yakında</p>
      )}
    </main>
  )
}
