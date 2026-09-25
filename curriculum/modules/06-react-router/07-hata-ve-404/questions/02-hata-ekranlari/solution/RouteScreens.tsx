import { Link, isRouteErrorResponse, useRouteError } from 'react-router'

export function NotFoundPage() {
  return (
    <main>
      <h1>Sayfa bulunamadı</h1>
      <Link to="/">Ana sayfaya dön</Link>
    </main>
  )
}
export function RouteError() {
  const error = useRouteError()
  const message =
    isRouteErrorResponse(error) && error.status === 404
      ? 'Sayfa bulunamadı'
      : 'Bir şeyler ters gitti'
  return (
    <main role="alert">
      <h1>{message}</h1>
      <Link to="/">Ana sayfaya dön</Link>
    </main>
  )
}
