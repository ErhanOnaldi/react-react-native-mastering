import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
export interface Movie {
  id: number
  title: string
}
export function VirtualMovies({ movies }: { movies: Movie[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: movies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 3,
    initialRect: { width: 320, height: 240 },
    getItemKey: (index) => movies[index].id,
  })
  return (
    <div ref={parentRef} style={{ height: 240, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }} role="list">
        {virtualizer.getVirtualItems().map((row) => (
          <div
            role="listitem"
            key={row.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${row.start}px)`,
              height: row.size,
              width: '100%',
            }}
          >
            {movies[row.index].title}
          </div>
        ))}
      </div>
    </div>
  )
}
