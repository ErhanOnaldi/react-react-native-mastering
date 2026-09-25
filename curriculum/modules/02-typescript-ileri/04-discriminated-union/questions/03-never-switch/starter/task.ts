export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
export function renderState<T>(state: RemoteData<T>, show: (data: T) => string): string {
  return ''
}
