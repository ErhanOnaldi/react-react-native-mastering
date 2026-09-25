import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/shared/api/query-client'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import '@/index.css'
import { FavoritesProvider } from '@/features/favorites/context/FavoritesContext'
import { router } from '@/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
