export type RemoteData<T> = { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: string }
export function renderState<T>(state: RemoteData<T>, show: (data: T) => string): string {
  switch (state.status) {
    case 'idle': return 'Henüz istek yok'
    case 'loading': return 'Yükleniyor…'
    case 'success': return show(state.data)
    case 'error': return `Hata: ${state.error}`
    default: {
      const exhaustive: never = state
      return exhaustive
    }
  }
}
