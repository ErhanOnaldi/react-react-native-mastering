import { useEffect, useState } from 'react'
import { FocusDialog } from './FocusDialog'

export default function Preview() {
  const [open, setOpen] = useState(false)
  const [seconds, setSeconds] = useState(0)
  // Üst bileşen her saniye render olur; FocusDialog her seferinde yeni bir onClose alır.
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <main>
      <input aria-label="Film ara" placeholder="Film ara" />
      <button type="button" onClick={() => setOpen(true)}>
        Fragmanı aç
      </button>
      <p>Sayfa {seconds} saniyedir açık</p>
      <FocusDialog open={open} onClose={() => setOpen(false)} />
    </main>
  )
}
