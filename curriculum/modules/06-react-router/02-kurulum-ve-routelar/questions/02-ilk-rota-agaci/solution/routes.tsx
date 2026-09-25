import { Link, type RouteObject } from 'react-router'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <main>
        <h1>Sinema</h1>
        <Link to="/search">Ara</Link>
      </main>
    ),
  },
  {
    path: '/search',
    element: (
      <main>
        <h1>Film ara</h1>
      </main>
    ),
  },
]
