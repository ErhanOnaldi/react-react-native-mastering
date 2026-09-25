import { Link, useParams } from 'react-router'
export function MovieRoute() {
  const { id } = useParams()
  return (
    <main>
      <h1>Film seçilmedi</h1>
      <a href="/search">Aramaya dön</a>
    </main>
  )
}
