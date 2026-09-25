import { NavLink } from 'react-router'

export function Menu() {
  return (
    <nav aria-label="Ana menü">
      <NavLink to="/" end>
        Ana sayfa
      </NavLink>
      <NavLink to="/search">Ara</NavLink>
    </nav>
  )
}
