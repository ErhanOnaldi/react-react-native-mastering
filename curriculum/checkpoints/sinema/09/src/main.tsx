import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import '@/index.css'
import { FavoritesProvider } from '@/features/favorites/context/FavoritesContext'
import { router } from '@/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  </StrictMode>,
)
