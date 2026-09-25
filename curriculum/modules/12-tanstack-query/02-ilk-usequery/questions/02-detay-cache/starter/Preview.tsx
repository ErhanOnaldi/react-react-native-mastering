import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { MovieDetail } from './MovieDetail'
const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
export default function Preview() {
  const [id, setId] = useState(550)
  return (
    <QueryClientProvider client={client}>
      <button onClick={() => setId(id === 550 ? 27205 : 550)}>Film değiştir ve geri dön</button>
      <MovieDetail id={id} />
    </QueryClientProvider>
  )
}
