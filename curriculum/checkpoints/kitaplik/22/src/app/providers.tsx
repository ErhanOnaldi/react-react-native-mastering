import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ReadingListProvider } from '@/features/reading-list/ReadingListProvider'

interface AppProvidersProps {
  queryClient: QueryClient
  children: ReactNode
}

/** Uygulamanın tüm global provider'ları tek yerde: main.tsx ve testler aynı ağacı kullanır. */
export function AppProviders({ queryClient, children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReadingListProvider>{children}</ReadingListProvider>
    </QueryClientProvider>
  )
}
