export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
export function isSuccess<T>(state: RemoteData<T>): state is { status: 'success'; data: T } {
  return false
}
export function message(state: RemoteData<unknown>): string {
  return ''
}
