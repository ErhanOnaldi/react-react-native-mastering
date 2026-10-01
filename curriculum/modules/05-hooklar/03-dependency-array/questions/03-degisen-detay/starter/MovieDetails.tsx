import { useState } from 'react'
export function MovieDetails({ id }: { id: number }) {
  const [title, setTitle] = useState('Yükleniyor')
  return <h2>{title}</h2>
}
