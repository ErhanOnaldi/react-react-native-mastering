import { createMemoryRouter, useNavigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { SearchPage } from './SearchPage'

function Page() {
  const navigate = useNavigate()
  return (
    <>
      <button onClick={() => navigate(-1)}>Geri</button>
      <SearchPage />
    </>
  )
}

const router = createMemoryRouter([{ path: '/search', element: <Page /> }], {
  initialEntries: ['/search?q=matrix'],
})

export default function Preview() {
  return <RouterProvider router={router} />
}
