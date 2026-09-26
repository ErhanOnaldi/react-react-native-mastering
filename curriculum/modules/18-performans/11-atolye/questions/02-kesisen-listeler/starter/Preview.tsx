import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { GenreBoard } from './GenreBoard'

const client = new QueryClient()
const router = createMemoryRouter([{ path: '/board', element: <GenreBoard /> }], {
  initialEntries: ['/board'],
})

export default function Preview() {
  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
