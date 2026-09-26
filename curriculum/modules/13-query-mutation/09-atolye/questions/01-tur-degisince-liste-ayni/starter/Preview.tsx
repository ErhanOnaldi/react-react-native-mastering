import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GenreDiscover } from './GenreDiscover'
const client = new QueryClient()
export default function Preview() {
  return (
    <QueryClientProvider client={client}>
      <GenreDiscover />
    </QueryClientProvider>
  )
}
