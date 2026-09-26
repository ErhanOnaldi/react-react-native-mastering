import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { GenreDiscover } from './GenreDiscover'
const client = new QueryClient()
const router = createMemoryRouter([{ path: '/discover', element: <GenreDiscover /> }], {
  initialEntries: ['/discover?genre=28&page=1'],
})
export default function Preview() {
  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
