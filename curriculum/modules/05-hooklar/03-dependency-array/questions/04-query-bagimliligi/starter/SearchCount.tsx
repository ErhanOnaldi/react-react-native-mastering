import { useEffect, useState } from 'react'
export function SearchCount({ query }: { query: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {}, [])
  return <p>{count} sonuç</p>
}
