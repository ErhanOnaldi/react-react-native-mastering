import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export function RouteErrorPage() {
  const error = useRouteError()
  const message =
    isRouteErrorResponse(error) && error.status === 404
      ? 'Sayfa bulunamadı.'
      : 'Sayfa açılırken bir sorun oluştu.'

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-8" role="alert">
      <h1 className="text-2xl font-semibold">Bir hata oluştu</h1>
      <p>{message}</p>
      <Link to="/" className="underline underline-offset-4">
        Ana sayfaya dön
      </Link>
    </main>
  )
}
