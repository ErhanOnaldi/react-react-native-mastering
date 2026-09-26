import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router'
import { bookQueries } from '../api/book-queries'
import { SEARCH_PAGE_SIZE } from '../api/books-api'
import { BookList } from '../components/BookList'
import { readSearchParams, searchHref, totalPages } from '../search-params'
import { ErrorMessage } from '@/shared/ui/ErrorMessage'
import { cn } from '@/shared/lib/cn'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const { q, page } = readSearchParams(searchParams)

  const query = useQuery({
    ...bookQueries.search({ q, page }),
    // Boş aramada istek atma
    enabled: q.length > 0,
    // Sayfa değişirken eski sonuçlar ekranda kalsın (liste boşalıp zıplamasın)
    placeholderData: keepPreviousData,
  })

  if (!q) {
    return (
      <p className="py-10 text-center text-stone-600">Aramak için bir kitap adı ya da yazar yaz.</p>
    )
  }
  if (query.isPending) {
    return (
      <p role="status" className="py-10 text-center text-stone-600">
        Aranıyor…
      </p>
    )
  }
  if (query.isError) {
    return <ErrorMessage message="Arama yapılamadı." onRetry={() => void query.refetch()} />
  }

  const { total, books } = query.data
  if (total === 0) {
    return (
      <p className="py-10 text-center text-stone-600">
        “{q}” için sonuç bulunamadı. Başka bir yazım dene.
      </p>
    )
  }

  const pages = totalPages(total, SEARCH_PAGE_SIZE)
  return (
    <section aria-busy={query.isPlaceholderData} className="space-y-4">
      <h1 className="font-serif text-2xl font-semibold">
        “{q}”{' '}
        <span className="text-base font-normal text-stone-600">
          — {total.toLocaleString('tr-TR')} sonuç
        </span>
      </h1>
      <div className={cn('transition-opacity', query.isPlaceholderData && 'opacity-60')}>
        <BookList books={books} />
      </div>
      <nav aria-label="Sayfalama" className="flex items-center justify-center gap-4">
        <PageLink to={page > 1 ? searchHref({ q, page: page - 1 }) : null}>Önceki</PageLink>
        <span className="text-sm text-stone-600">
          Sayfa {page} / {pages.toLocaleString('tr-TR')}
        </span>
        <PageLink to={page < pages ? searchHref({ q, page: page + 1 }) : null}>Sonraki</PageLink>
      </nav>
    </section>
  )
}

function PageLink({ to, children }: { to: string | null; children: string }) {
  const className = 'rounded-md border px-3 py-1.5 text-sm'
  if (to === null) {
    return (
      <span aria-disabled="true" className={cn(className, 'border-stone-200 text-stone-400')}>
        {children}
      </span>
    )
  }
  return (
    <Link to={to} className={cn(className, 'border-stone-300 hover:border-accent-500')}>
      {children}
    </Link>
  )
}
