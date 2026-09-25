import { Link } from 'react-router'

export function Menu() {
  return (
    <nav>
      <Link to="/">Ana sayfa</Link>
      <Link to="/search">Ara</Link>
    </nav>
  )
}
