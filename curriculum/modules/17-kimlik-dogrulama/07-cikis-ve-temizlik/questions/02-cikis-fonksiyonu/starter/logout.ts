import type { QueryClient } from '@tanstack/react-query'
export interface LogoutDeps {
  queryClient: QueryClient
  storage: Pick<Storage, 'removeItem'>
  resetStore(): void
}
export function logout(deps: LogoutDeps): void {}
