import { useState } from 'react'
export function useFavoriteIds() {
  const [ids, setIds] = useState<number[]>([])
  function toggle(id: number) {
    setIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }
  return { ids, toggle }
}
