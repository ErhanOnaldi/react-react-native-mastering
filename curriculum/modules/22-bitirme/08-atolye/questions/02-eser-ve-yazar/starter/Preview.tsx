import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { BookDetail } from './BookDetail'

const client = new QueryClient()
const router = createMemoryRouter([{ path: '/books/:workId', element: <BookDetail /> }], {
  initialEntries: ['/books/OL893414W'],
})

export default function Preview() {
  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
