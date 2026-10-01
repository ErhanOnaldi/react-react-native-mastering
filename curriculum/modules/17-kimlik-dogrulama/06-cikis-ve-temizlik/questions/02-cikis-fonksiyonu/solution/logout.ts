import type { QueryClient } from '@tanstack/react-query'
export interface LogoutDeps {
  queryClient: QueryClient
  storage: Pick<Storage, 'removeItem'>
  resetStore(): void
}
export function logout({ queryClient, storage, resetStore }: LogoutDeps): void {
  try {
    storage.removeItem('sinema-auth')
  } catch {
    // Depo kullanılamasa da bellekteki oturum verisini temizle.
  }
  resetStore()
  queryClient.clear()
}
