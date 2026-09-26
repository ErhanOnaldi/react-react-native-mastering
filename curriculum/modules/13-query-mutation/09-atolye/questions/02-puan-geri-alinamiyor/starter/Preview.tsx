import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MovieRating } from './MovieRating'
const client = new QueryClient()
export default function Preview() {
  return (
    <QueryClientProvider client={client}>
      <MovieRating />
    </QueryClientProvider>
  )
}
