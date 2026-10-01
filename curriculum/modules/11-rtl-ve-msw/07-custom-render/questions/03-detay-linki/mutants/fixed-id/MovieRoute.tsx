import { Link, useParams } from 'react-router'

export function MovieRoute() {
  useParams()
  return (
    <main>
      <h1>Film #550</h1>
      <Link to="/search">Aramaya dön</Link>
    </main>
  )
}
