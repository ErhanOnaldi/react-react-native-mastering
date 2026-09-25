export type RemoteData<T> = { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: string }
export function isSuccess<T>(state: RemoteData<T>): state is { status: 'success'; data: T } { return state.status === 'success' }
export function message(state: RemoteData<unknown>): string {
  switch (state.status) {
    case 'idle': return 'Hazır'
    case 'loading': return 'Yükleniyor'
    case 'success': return 'Tamam'
    case 'error': return state.error
  }
}
