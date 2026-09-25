import { useState } from 'react'
export function ResultPanel() {
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <button type="button">Yükle</button>
      <p>{loading ? 'Yükleniyor' : 'Hazır'}</p>
    </div>
  )
}
