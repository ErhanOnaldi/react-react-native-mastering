import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { buttonVariants } from '@/components/ui/button-variants'

export function RouteError({ notFound }: { notFound?: boolean }) {
  const error = useRouteError()
  const title =
    notFound || (isRouteErrorResponse(error) && error.status === 404)
      ? 'Sayfa bulunamadı'
      : 'Bir şeyler ters gitti'
  const detail = error instanceof Error ? error.message : undefined
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {detail && (
        <pre className="mt-4 overflow-auto rounded-lg bg-surface-2 p-3 text-left text-xs text-danger">
          {detail}
        </pre>
      )}
      <Link to="/" className={buttonVariants({ variant: 'primary', className: 'mt-6' })}>
        Panoya dön
      </Link>
    </div>
  )
}
