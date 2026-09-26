import { createMemoryRouter, RouterProvider } from 'react-router'
import { SearchWorkspace } from './SearchWorkspace'

const router = createMemoryRouter([{ path: '/search', element: <SearchWorkspace /> }], {
  initialEntries: ['/search?q=Matrix&page=1'],
})
export default function Preview() {
  return <RouterProvider router={router} />
}
