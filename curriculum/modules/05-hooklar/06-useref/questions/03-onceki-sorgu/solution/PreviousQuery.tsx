import { useEffect, useRef } from 'react'
export function PreviousQuery({ query }: { query: string }) {
  const previous = useRef<string | null>(null)
  useEffect(() => {
    previous.current = query
  }, [query])
  return <p>Önceki: {previous.current ?? 'yok'}</p>
}
