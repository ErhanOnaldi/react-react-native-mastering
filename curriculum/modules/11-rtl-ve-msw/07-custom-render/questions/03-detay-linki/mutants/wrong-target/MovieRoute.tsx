import { Link, useParams } from 'react-router'

export function MovieRoute() {
  const { id } = useParams()
  return (
    <main>
      <h1>{id ? `Film #${id}` : 'Film seçilmedi'}</h1>
      <Link to="/movie">Aramaya dön</Link>
    </main>
  )
}
