export const hookSource = `
import { useEffect } from 'react'
export function MovieNotice({ id }: { id: string | null }) {
  if (!id) return <p>Film seç</p>
  useEffect(() => { document.title = id }, [id])
  return <p>Film {id}</p>
}
`
