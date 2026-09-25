import { NavLink, Outlet } from 'react-router'

export function RootLayout() {
  return (
    <>
      <nav aria-label="Ana menü">
        <NavLink to="/" end>
          Ana sayfa
        </NavLink>
        <NavLink to="/search">Ara</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}
