import { useEffect, useState } from 'react'
interface Movie {
  title: string
}
export function MovieTitle({ id }: { id: number }) {
  const [title, setTitle] = useState<string | null>(null)
  useEffect(() => {
    setTitle(null)
  }, [id])
  return <p role="status">Yükleniyor</p>
}
