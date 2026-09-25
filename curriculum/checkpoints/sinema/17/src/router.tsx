import { createBrowserRouter, type RouteObject } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { HomePage } from '@/pages/HomePage'
import { MovieDetailsPage } from '@/pages/MovieDetailsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SearchPage } from '@/pages/SearchPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import RatedPage from '@/pages/RatedPage'
import { WatchlistsPage } from '@/pages/WatchlistsPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { useAppSelector } from '@/app/store'
import { movieQueries } from '@/features/movies/api/movie-queries'
import { queryClient } from '@/shared/api/query-client'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      {
        path: 'movie/:id',
        loader: async ({ params }) => {
          const id = params.id
          const movieId = id && /^[1-9]\d*$/.test(id) ? Number(id) : NaN
          if (!Number.isSafeInteger(movieId))
            throw new Error('Geçersiz film adresi.')
          return await queryClient.ensureQueryData(movieQueries.detail(movieId))
        },
        element: <MovieDetailsPage />,
        errorElement: <RouteErrorPage />,
      },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'rated', element: <RatedPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        element: <AuthenticatedPages />,
        children: [
          { path: 'watchlists', element: <WatchlistsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
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
