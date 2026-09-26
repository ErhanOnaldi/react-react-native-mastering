import { startTransition, useOptimistic, useRef, useState } from 'react'
import { Button } from '@/shared/ui/button'

export function OptimisticFavoriteButton({
  initialFavorite,
  onSave,
}: {
  initialFavorite: boolean
  onSave: (next: boolean) => Promise<void>
}) {
  const [favorite, setFavorite] = useState(initialFavorite)
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(favorite)
  const saving = useRef(false)

  function toggle() {
    if (saving.current) return
    saving.current = true
    const next = !optimisticFavorite
    startTransition(async () => {
      setOptimisticFavorite(next)
      try {
        await onSave(next)
        startTransition(() => setFavorite(next))
      } catch {
        // The optimistic state falls back to the confirmed state.
      } finally {
        saving.current = false
      }
    })
  }

  return (
    // Görünür metin adı ve durumu birlikte anlatıyor; aria-pressed/aria-label gereksiz ve çelişkili olurdu.
    <Button variant="ghost" onClick={toggle}>
      {optimisticFavorite ? 'Favorilerden çıkar' : 'Favoriye ekle'}
    </Button>
  )
}
