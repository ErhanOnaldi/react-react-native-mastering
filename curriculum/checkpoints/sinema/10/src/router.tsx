import { createBrowserRouter, type RouteObject } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { HomePage } from '@/pages/HomePage'
import { MovieDetailsPage } from '@/pages/MovieDetailsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SearchPage } from '@/pages/SearchPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'movie/:id', element: <MovieDetailsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
