export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export function isIdle<T>(state: RemoteData<T>): state is { status: 'idle' } {
  return state.status === 'idle'
}

export function isLoading<T>(state: RemoteData<T>): state is { status: 'loading' } {
  return state.status === 'loading'
}

export function isSuccess<T>(state: RemoteData<T>): state is { status: 'success'; data: T } {
  return state.status === 'success'
}

export function isError<T>(state: RemoteData<T>): state is { status: 'error'; error: string } {
  return state.status === 'error'
}
