import { Link } from 'react-router'
import type { BookSummary } from '../api/schemas'
import { formatAuthors } from '../format'
import { BookCover } from './BookCover'

export function BookList({ books }: { books: BookSummary[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {books.map((book) => (
        <li key={book.id} className="flex gap-3 rounded-lg border border-stone-200 bg-white p-3">
          <BookCover coverId={book.coverId} title={book.title} className="h-24 w-16 shrink-0" />
          <div className="min-w-0">
            <Link
              to={`/works/${book.id}`}
              className="font-serif text-lg font-semibold text-ink hover:text-accent-600"
            >
              {book.title}
            </Link>
            <p className="text-sm text-stone-600">{formatAuthors(book.authors)}</p>
            {book.firstPublishYear !== null && (
              <p className="text-xs text-stone-500">İlk baskı: {book.firstPublishYear}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
