import { useState } from 'react'
import { ReviewForm } from './ReviewForm'
import type { ReviewValues } from './reviewSchema'

export default function Preview() {
  const [sent, setSent] = useState<ReviewValues | null>(null)
  return (
    <main style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <h1>Dövüş Kulübü</h1>
      <ReviewForm onSubmit={setSent} />
      <p aria-live="polite">
        {sent ? `Gönderildi: ${JSON.stringify(sent)}` : 'Henüz gönderilmedi'}
      </p>
    </main>
  )
}
