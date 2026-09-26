import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { MovieSearchPage } from './MovieSearchPage'

const client = new QueryClient()
const router = createMemoryRouter([{ path: '/search', element: <MovieSearchPage /> }], {
  initialEntries: ['/search?q=Matrix&page=1'],
})

export default function Preview() {
  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
