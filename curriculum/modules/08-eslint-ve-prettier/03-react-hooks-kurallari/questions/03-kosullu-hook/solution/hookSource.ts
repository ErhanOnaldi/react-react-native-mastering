export const hookSource = `
import { useEffect } from 'react'
export function MovieNotice({ id }: { id: string | null }) {
  useEffect(() => {
    if (id) document.title = id
  }, [id])
  if (!id) return <p>Film seç</p>
  return <p>Film {id}</p>
}
`
