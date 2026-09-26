import type { QueryClient } from '@tanstack/react-query'
import type { RouteObject } from 'react-router'
import { bookQueries } from '@/features/books/api/book-queries'
import { HomePage } from '@/features/books/pages/HomePage'
import { SearchPage } from '@/features/books/pages/SearchPage'
import { WorkPage } from '@/features/books/pages/WorkPage'
import { ReadingListPage } from '@/features/reading-list/ReadingListPage'
import { NotFoundPage } from './NotFoundPage'
import { RootLayout } from './RootLayout'
import { RouteErrorPage } from './RouteErrorPage'

/**
 * Route ağacı bir fabrika: QueryClient dışarıdan verilir (main.tsx'te tekil istemci,
 * testlerde her test için taze istemci). Loader'lar da aynı istemciyi kullanır.
 */
export function createRoutes(queryClient: QueryClient): RouteObject[] {
  return [
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'search', element: <SearchPage /> },
        {
          path: 'works/:workId',
          element: <WorkPage />,
          // Bileşen render olmadan veriyi istemeye başla; beklemeden sayfaya geç (bekleme sayfada gösterilir)
          loader: ({ params }) => {
            if (params.workId) void queryClient.prefetchQuery(bookQueries.work(params.workId))
            return null
          },
        },
        { path: 'reading-list', element: <ReadingListPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]
}
