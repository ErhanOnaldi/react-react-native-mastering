import { NavLink, Outlet } from 'react-router'
import { appTitle } from '../config'

const links = [
  { to: '/', label: 'Ana sayfa', end: true },
  { to: '/search', label: 'Ara', end: false },
  { to: '/favorites', label: 'Favoriler', end: false },
]

export function RootLayout() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold tracking-tight">{appTitle}</h1>
        <p className="mt-1 text-slate-400">Bugün ne izlesek?</p>
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
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
