import { QueryClient } from '@tanstack/react-query'
import { isNotFound } from '@/features/books/api/open-library'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        // 404 kalıcıdır: tekrar denemek boşuna bekletir. Diğer hatalarda bir kez daha dene.
        retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
      },
    },
  })
}
