export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
export type RemoteAction<T> =
  | { type: 'start' }
  | { type: 'resolve'; data: T }
  | { type: 'reject'; error: string }
  | { type: 'reset' }
export function transition<T>(state: RemoteData<T>, action: RemoteAction<T>): RemoteData<T> {
  return state
}
