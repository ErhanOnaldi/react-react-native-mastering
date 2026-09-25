export type ResultState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; movies: { id: number; title: string }[] }

export function MovieResult({ state }: { state: ResultState }) {
  if (state.status === 'loading') return <p>Filmler yükleniyor</p>
  if (state.status === 'error') return <p>Hata: {state.message}</p>
  if (state.movies.length === 0) return <p>Film bulunamadı</p>
  return (
    <ul>
      {state.movies.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  )
}
