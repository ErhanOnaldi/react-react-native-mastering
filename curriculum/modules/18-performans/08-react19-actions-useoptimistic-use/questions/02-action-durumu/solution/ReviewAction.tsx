import { useActionState } from 'react'

async function saveReview(_previous: string, formData: FormData): Promise<string> {
  const review = String(formData.get('review') ?? '').trim()
  return review ? `Kaydedildi: ${review}` : 'Yorum boş olamaz'
}
export function ReviewAction() {
  const [message, formAction, isPending] = useActionState(saveReview, '')
  return (
    <form action={formAction}>
      <label>
        Yorum <input name="review" />
      </label>
      <button type="submit" disabled={isPending}>
        Kaydet
      </button>
      <p role="status">{message}</p>
    </form>
  )
}
