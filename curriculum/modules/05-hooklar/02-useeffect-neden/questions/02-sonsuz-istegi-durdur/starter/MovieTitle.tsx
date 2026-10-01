import { useState } from 'react'
export function MovieTitle({ id }: { id: number }) {
  const [movie, setMovie] = useState<{ title: string } | null>(null)
  return <h1>{movie?.title ?? 'Yükleniyor…'}</h1>
}
