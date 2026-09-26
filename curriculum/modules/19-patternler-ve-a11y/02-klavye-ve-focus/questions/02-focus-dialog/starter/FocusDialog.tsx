import { useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export function FocusDialog({ open, onClose }: Props) {
  useEffect(() => {
    // Açılış focus'u, Tab sınırları, Escape ve focus'u geri verme burada.
  }, [open, onClose])

  if (!open) return null
  return (
    <div>
      <h2>Fragman</h2>
      <button type="button">Oynat</button>
      <button type="button" onClick={onClose}>
        Kapat
      </button>
    </div>
  )
}
