import { startTransition, useOptimistic, useState } from 'react'
export function OptimisticFavorite({
  initial,
  save,
}: {
  initial: boolean
  save: (next: boolean) => Promise<void>
}) {
  const [favorite, setFavorite] = useState(initial)
  const [optimistic, setOptimistic] = useOptimistic(favorite)
  function toggle() {
    const next = !optimistic
    startTransition(async () => {
      setOptimistic(next)
      try {
        await save(next)
        setFavorite(next)
      } catch {
        /* geçici görünüm temel state'e döner */
      }
    })
  }
  return (
    <button type="button" onClick={toggle} aria-pressed={optimistic}>
      {optimistic ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    </button>
  )
}
