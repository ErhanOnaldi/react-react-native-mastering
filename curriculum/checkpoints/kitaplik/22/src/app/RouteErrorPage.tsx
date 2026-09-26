import { Link, useRouteError } from 'react-router'

export function RouteErrorPage() {
  const error = useRouteError()
  return (
    <section role="alert" className="mx-auto max-w-xl space-y-3 py-10 text-center">
      <h1 className="font-serif text-3xl font-semibold">Beklenmeyen bir hata oldu</h1>
      <p className="text-stone-600">{error instanceof Error ? error.message : 'Bilinmeyen hata'}</p>
      <Link to="/" className="text-accent-600 underline">
        Ana sayfaya dön
      </Link>
    </section>
  )
}
