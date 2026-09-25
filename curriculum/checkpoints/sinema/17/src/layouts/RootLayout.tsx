import { Link, NavLink, Outlet } from 'react-router'
import { resetUserState, useAppSelector } from '@/app/store'
import { logout } from '@/features/auth/logout'
import { queryClient } from '@/shared/api/query-client'
import { ThemeControl } from './ThemeControl'
import { appTitle } from '@/shared/config/app'

const links = [
  { to: '/', label: 'Ana sayfa', end: true },
  { to: '/search', label: 'Ara', end: false },
  { to: '/favorites', label: 'Favoriler', end: false },
  { to: '/rated', label: 'Puanladıklarım', end: false },
  { to: '/watchlists', label: 'İzleme listelerim', end: false },
]

export function RootLayout() {
  const theme = useAppSelector((state) => state.ui.theme)
  const user = useAppSelector((state) => state.auth.user)
  return (
    <div
      className={`${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-white text-slate-950'} min-h-screen`}
    >
      <div className="mx-auto max-w-5xl p-8">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tight">{appTitle}</h1>
          <p className="mt-1 text-slate-400">Bugün ne izlesek?</p>
          <ThemeControl />
          <nav aria-label="Ana menü" className="mt-6 flex flex-wrap gap-4">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive
                    ? 'font-semibold underline underline-offset-4'
                    : 'hover:underline'
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4">
            {user ? (
              <>
                <Link to="/profile">{user.username}</Link>{' '}
                <button
                  type="button"
                  onClick={() =>
                    logout({
                      queryClient,
                      storage: localStorage,
                      resetStore: resetUserState,
                    })
                  }
                >
                  Çıkış yap
                </button>
              </>
            ) : (
              <Link to="/login">Giriş yap</Link>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        <RecentlyViewed />
      </div>
    </div>
  )
}

function RecentlyViewed() {
  const ids = useAppSelector((state) => state.recentlyViewed.ids)
  if (ids.length === 0) return null
  return (
    <nav aria-label="Son bakılan filmler" className="mt-8">
      <h2 className="font-semibold">Son bakılanlar</h2>
      <ul className="flex gap-3">
        {ids.map((id) => (
          <li key={id}>
            <Link to={`/movie/${id}`}>Film {id}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
