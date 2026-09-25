import { QueryClient } from '@tanstack/react-query'
export function makeClient(notify: (message: string) => void): QueryClient {
  void notify
  return new QueryClient()
}
