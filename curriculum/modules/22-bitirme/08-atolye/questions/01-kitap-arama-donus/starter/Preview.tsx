import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { BookSearch } from './BookSearch'

const client = new QueryClient()
const router = createMemoryRouter([{ path: '/search', element: <BookSearch /> }], {
  initialEntries: ['/search?q=Dune&page=1'],
})

export default function Preview() {
  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
