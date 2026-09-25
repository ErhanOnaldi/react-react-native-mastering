export const detailsSource = `
import { useEffect } from 'react'
export function MovieDetails({ id }: { id: string }) {
  useEffect(() => {
    document.title = 'Film ' + id
  }, [id])
  return <h1>Film {id}</h1>
}
`
