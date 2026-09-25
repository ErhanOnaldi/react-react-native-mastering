import { Link } from 'react-router'

export function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/">Ana sayfa</Link>
        <Link to="/search">Ara</Link>
      </nav>
      <main />
    </>
  )
}
