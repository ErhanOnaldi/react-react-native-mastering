type Movie = { id: number; title: string }
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }
export function RemoteView({ state }: { state: RemoteData<Movie[]> }) {
  if (state.status === 'idle') return <p>Arama yap</p>
  if (state.status === 'loading') return <p>Yükleniyor</p>
  if (state.status === 'error') return <p role="alert">{state.message}</p>
  if (state.data.length === 0) return <p>Film bulunamadı</p>
  return (
    <ul>
      {state.data.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  )
}
