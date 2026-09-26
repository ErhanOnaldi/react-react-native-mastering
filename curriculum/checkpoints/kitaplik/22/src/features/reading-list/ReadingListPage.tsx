import { Link, useSearchParams } from 'react-router'
import { BookCover } from '@/features/books/components/BookCover'
import { readingStatuses, statusLabels, type ReadingStatus } from './schemas'
import { useReadingList } from './useReadingList'
import { cn } from '@/shared/lib/cn'

function readStatus(value: string | null): ReadingStatus | null {
  return readingStatuses.find((s) => s === value) ?? null
}

export function ReadingListPage() {
  const { entries, remove } = useReadingList()
  const [searchParams] = useSearchParams()
  const status = readStatus(searchParams.get('status'))
  const visible = status ? entries.filter((e) => e.status === status) : entries

  const filters: { label: string; value: ReadingStatus | null }[] = [
    { label: 'Tümü', value: null },
    ...readingStatuses.map((s) => ({ label: statusLabels[s], value: s })),
  ]

  return (
    <section className="space-y-4">
      <h1 className="font-serif text-3xl font-semibold">Okuma listem</h1>

      {entries.length === 0 ? (
        <p className="text-stone-600">
          Okuma listen boş.{' '}
          <Link to="/" className="text-accent-600 underline">
            Bir kitap ara
          </Link>{' '}
          ve detay sayfasından ekle.
        </p>
      ) : (
        <>
          <nav aria-label="Durum filtresi" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Link
                key={f.label}
                to={f.value ? `/reading-list?status=${f.value}` : '/reading-list'}
                aria-current={f.value === status ? 'page' : undefined}
                className={cn(
                  'rounded-full border px-3 py-1 text-sm',
                  f.value === status ? 'border-ink bg-ink text-paper' : 'border-stone-300',
                )}
              >
                {f.label}
              </Link>
            ))}
          </nav>
          {visible.length === 0 ? (
            <p className="text-stone-600">Bu durumda kitap yok.</p>
          ) : (
            <ul className="space-y-3">
              {visible.map((entry) => (
                <li
                  key={entry.workId}
                  className="flex gap-3 rounded-lg border border-stone-200 bg-white p-3"
                >
                  <BookCover
                    coverId={entry.coverId}
                    title={entry.title}
                    size="S"
                    className="h-16 w-11 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      to={`/works/${entry.workId}`}
                      className="font-serif text-lg font-semibold hover:text-accent-600"
                    >
                      {entry.title}
                    </Link>
                    <p className="text-sm text-stone-600">
                      {statusLabels[entry.status]}
                      {entry.rating !== null && ` · Puan: ${entry.rating}/5`}
                    </p>
                    {entry.note && <p className="text-sm text-stone-800">{entry.note}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(entry.workId)}
                    aria-label={`${entry.title} kitabını listeden çıkar`}
                    className="self-start rounded-md border border-stone-300 px-2 py-1 text-sm hover:border-red-400"
                  >
                    Çıkar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
