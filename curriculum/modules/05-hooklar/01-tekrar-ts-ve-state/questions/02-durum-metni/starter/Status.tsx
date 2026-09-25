export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
export function Status({ result }: { result: RemoteData<string[]> }) {
  return <p>Hazır</p>
}
