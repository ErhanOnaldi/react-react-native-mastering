type Movie = { id: number; title: string }
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }
export function RemoteView({ state }: { state: RemoteData<Movie[]> }) {
  return <p>Arama yap</p>
}
