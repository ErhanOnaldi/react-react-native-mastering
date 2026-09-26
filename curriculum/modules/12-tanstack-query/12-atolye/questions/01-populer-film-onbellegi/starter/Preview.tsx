import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { PopularMovies } from './PopularMovies'
const client = new QueryClient()
export default function Preview() {
  const [open, setOpen] = useState(true)
  return (
    <QueryClientProvider client={client}>
      <button onClick={() => setOpen(!open)}>{open ? 'Ayrıl' : 'Dön'}</button>
      {open && <PopularMovies />}
    </QueryClientProvider>
  )
}
