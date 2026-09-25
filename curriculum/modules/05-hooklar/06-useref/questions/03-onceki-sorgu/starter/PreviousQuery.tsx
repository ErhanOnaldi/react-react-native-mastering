import { useRef } from 'react'
export function PreviousQuery({ query }: { query: string }) {
  const previous = useRef<string | null>(null)
  return <p>Önceki: {previous.current ?? 'yok'}</p>
}
