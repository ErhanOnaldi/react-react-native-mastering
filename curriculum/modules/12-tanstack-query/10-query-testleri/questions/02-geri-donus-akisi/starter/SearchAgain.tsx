import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
export function SearchAgain({ query }: { query: string }) {
  const [details, setDetails] = useState(false)
  return (
    <div>
      <button onClick={() => setDetails(!details)}>{details ? 'Geri' : 'Detay'}</button>
      <p>Sonuç bekleniyor</p>
    </div>
  )
}
