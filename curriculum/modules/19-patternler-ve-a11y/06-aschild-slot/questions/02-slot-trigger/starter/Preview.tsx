import { useState } from 'react'
import { SlotTrigger } from './SlotTrigger'
export default function Preview() {
  const [opened, setOpened] = useState(false)
  return (
    <div>
      <p>Dövüş Kulübü</p>
      <SlotTrigger asChild onOpen={() => setOpened(true)} className="rounded border p-2">
        <button type="button">Fragmanı aç</button>
      </SlotTrigger>
      <p aria-live="polite">{opened ? 'Fragman açıldı' : 'Fragman kapalı'}</p>
    </div>
  )
}
