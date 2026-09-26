import { useQueries, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { bookQueries } from '../api/book-queries'
import { isNotFound } from '../api/open-library'
import { BookCover } from '../components/BookCover'
import { formatAuthors } from '../format'
import { ReadingListForm } from '@/features/reading-list/ReadingListForm'
import { ErrorMessage } from '@/shared/ui/ErrorMessage'

export function WorkPage() {
  const { workId = '' } = useParams()
  const work = useQuery(bookQueries.work(workId))

  // Bağımlı sorgular: yazar id'leri eserden gelir. Bir yazar alınamazsa sayfa yine çalışır.
  const authors = useQueries({
    queries: (work.data?.authorIds ?? []).map((id) => bookQueries.author(id)),
    combine: (results) => ({
      names: results.flatMap((r) => (r.data ? [r.data.name] : [])),
      isPending: results.some((r) => r.isPending),
    }),
  })

  if (work.isPending) {
    return (
      <p role="status" className="py-10 text-center text-stone-600">
        Kitap yükleniyor…
      </p>
    )
  }
  if (work.isError) {
    if (isNotFound(work.error)) {
      return (
        <section className="space-y-3 py-10 text-center">
          <h1 className="font-serif text-3xl font-semibold">Kitap bulunamadı</h1>
          <p className="text-stone-600">Bu bağlantıdaki eser Open Library’de yok.</p>
          <Link to="/" className="text-accent-600 underline">
            Aramaya dön
          </Link>
        </section>
      )
    }
    return <ErrorMessage message="Kitap bilgisi alınamadı." onRetry={() => void work.refetch()} />
  }

  const book = work.data
  return (
    <article className="grid gap-6 md:grid-cols-[12rem_1fr]">
      <BookCover coverId={book.coverId} title={book.title} size="L" className="h-72 w-48" />
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="font-serif text-4xl font-bold">{book.title}</h1>
          <p className="text-lg text-stone-600">
            {authors.isPending ? 'Yazar yükleniyor…' : formatAuthors(authors.names)}
          </p>
        </header>
        <p className="leading-relaxed whitespace-pre-line text-stone-800">
          {book.description ?? 'Açıklama yok.'}
        </p>
        {book.subjects.length > 0 && (
          <ul aria-label="Konular" className="flex flex-wrap gap-2">
            {book.subjects.map((subject) => (
              <li
                key={subject}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
              >
                {subject}
              </li>
            ))}
          </ul>
        )}
        <ReadingListForm
          key={book.id}
          book={{
            workId: book.id,
            title: book.title,
            authors: authors.names,
            coverId: book.coverId,
          }}
        />
      </div>
    </article>
  )
}
