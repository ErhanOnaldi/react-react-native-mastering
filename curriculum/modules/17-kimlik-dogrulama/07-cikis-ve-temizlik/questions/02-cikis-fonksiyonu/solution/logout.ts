import type { QueryClient } from '@tanstack/react-query'
export interface LogoutDeps {
  queryClient: QueryClient
  storage: Pick<Storage, 'removeItem'>
  resetStore(): void
}
export function logout({ queryClient, storage, resetStore }: LogoutDeps): void {
  storage.removeItem('sinema-auth')
  resetStore()
  queryClient.clear()
}
