import { useState } from 'react'
export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
export function useFetch<T>(url: string | null): RemoteData<T> {
  const [state] = useState<RemoteData<T>>({ status: 'idle' })
  return state
}
