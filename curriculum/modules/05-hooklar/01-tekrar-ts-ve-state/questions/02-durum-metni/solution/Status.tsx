export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
export function Status({ result }: { result: RemoteData<string[]> }) {
  if (result.status === 'idle') return <p>Aramaya başla</p>
  if (result.status === 'loading') return <p>Yükleniyor</p>
  if (result.status === 'error') return <p>Hata: {result.error}</p>
  return <p>{result.data.length === 0 ? 'Sonuç yok' : `${result.data.length} film`}</p>
}
