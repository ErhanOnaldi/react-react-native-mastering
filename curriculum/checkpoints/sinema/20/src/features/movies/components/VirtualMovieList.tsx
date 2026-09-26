import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

interface ListMovie {
  id: number
  title: string
}

export function VirtualMovieList({
  movies,
  query,
}: {
  movies: ListMovie[]
  query: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const normalized = query.trim().toLocaleLowerCase('tr-TR')
  const filtered = movies.filter((movie) =>
    movie.title.toLocaleLowerCase('tr-TR').includes(normalized),
  )
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    initialRect: { width: 320, height: 240 },
    estimateSize: () => 48,
    getItemKey: (index) => filtered[index].id,
    overscan: 3,
  })

  if (filtered.length === 0) return <p role="status">Film bulunamadı</p>
  if (filtered.length < 30)
    return (
      <ul aria-label="Film sonuçları" className="space-y-2">
        {filtered.map((movie) => (
          <li key={movie.id}>
            <a href={`/movie/${movie.id}`} className="hover:underline">
              {movie.title}
            </a>
          </li>
        ))}
      </ul>
    )
  return (
    <div
      ref={scrollRef}
      style={{ height: 240, overflowY: 'auto' }}
      aria-label="Film sonuçları"
    >
      <ul
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const movie = filtered[row.index]
          return (
            <li
              key={movie.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: row.size,
                transform: `translateY(${row.start}px)`,
              }}
            >
              <a
                href={`/movie/${movie.id}`}
                className="block p-3 hover:underline"
              >
                {movie.title}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
