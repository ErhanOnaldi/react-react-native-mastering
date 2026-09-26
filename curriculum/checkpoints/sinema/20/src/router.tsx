import { createBrowserRouter, type RouteObject } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { useAppSelector } from '@/app/store'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/pages/HomePage')).HomePage,
        }),
      },
      {
        path: 'search',
        lazy: async () => ({
          Component: (await import('@/pages/SearchPage')).SearchPage,
        }),
      },
      {
        path: 'movie/:id',
        lazy: () => import('@/pages/movie-details-route'),
        errorElement: <RouteErrorPage />,
      },
      {
        path: 'favorites',
        lazy: async () => ({
          Component: (await import('@/pages/FavoritesPage')).FavoritesPage,
        }),
      },
      {
        path: 'rated',
        lazy: async () => ({
          Component: (await import('@/pages/RatedPage')).default,
        }),
      },
      {
        path: 'login',
        lazy: async () => ({
          Component: (await import('@/pages/LoginPage')).LoginPage,
        }),
      },
      {
        element: <AuthenticatedPages />,
        children: [
          {
            path: 'watchlists',
            lazy: async () => ({
              Component: (await import('@/pages/WatchlistsPage'))
                .WatchlistsPage,
            }),
          },
          {
            path: 'profile',
            lazy: async () => ({
              Component: (await import('@/pages/ProfilePage')).ProfilePage,
            }),
          },
        ],
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('@/pages/NotFoundPage')).NotFoundPage,
        }),
      },
    ],
  },
]

export const router = createBrowserRouter(routes)

function AuthenticatedPages() {
  const isAuthenticated = useAppSelector((state) =>
    Boolean(state.auth.accessToken),
  )
  return <ProtectedRoute isAuthenticated={isAuthenticated} />
}
