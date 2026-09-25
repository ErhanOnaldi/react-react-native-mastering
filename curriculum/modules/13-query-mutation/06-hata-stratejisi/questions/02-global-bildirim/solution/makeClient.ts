import { MutationCache, QueryClient } from '@tanstack/react-query'
export function makeClient(notify: (message: string) => void): QueryClient {
  return new QueryClient({
    mutationCache: new MutationCache({ onError: () => notify('İşlem kaydedilemedi') }),
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}
