import { createMemoryRouter, RouterProvider } from 'react-router'
import { MovieWorkspace } from './MovieWorkspace'

const router = createMemoryRouter([{ path: '/workspace', element: <MovieWorkspace /> }], {
  initialEntries: ['/workspace?genre=28&page=1'],
})

export default function Preview() {
  return <RouterProvider router={router} />
}
