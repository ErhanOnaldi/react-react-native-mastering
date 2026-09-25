import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
export interface Movie {
  id: number
  title: string
}
export function FilteredVirtualMovies({ movies, query }: { movies: Movie[]; query: string }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const filtered = useMemo(
    () =>
      movies.filter((movie) =>
        movie.title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')),
      ),
    [movies, query],
  )
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 3,
    initialRect: { width: 320, height: 240 },
    getItemKey: (index) => filtered[index].id,
  })
  return (
    <div ref={parentRef} style={{ height: 240, overflow: 'auto' }}>
      <div role="list" style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            role="listitem"
            key={row.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${row.start}px)`,
              height: row.size,
            }}
          >
            {filtered[row.index].title}
          </div>
        ))}
      </div>
    </div>
  )
}
