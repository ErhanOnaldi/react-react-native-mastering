import type { QueryClient } from '@tanstack/react-query'
import { AUTH_STORAGE_KEY } from './auth-storage'

export function logout({
  queryClient,
  storage,
  resetStore,
}: {
  queryClient: QueryClient
  storage: Pick<Storage, 'removeItem'>
  resetStore: () => void
}) {
  storage.removeItem(AUTH_STORAGE_KEY)
  resetStore()
  queryClient.clear()
}
