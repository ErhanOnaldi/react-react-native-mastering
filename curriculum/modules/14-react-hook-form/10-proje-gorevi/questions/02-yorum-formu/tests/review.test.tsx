import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { requests } from '@test-utils'
import { describe, expect, it } from 'vitest'
import { ReviewForm } from '@project/src/features/watchlists/ReviewForm'
function show() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <ReviewForm postId={550} />
    </QueryClientProvider>,
  )
}
describe('Sinema yorum formu', () => {
  it('boş metin ve puanla istek atmaz, alan hatalarını gösterir', async () => {
    const u = userEvent.setup()
    show()
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    const ratingError = screen.getByText('Puan seç')
    const bodyError = screen.getByText('Yorum gerekli')
    const ratingGroup = screen.getByRole('group', { name: 'Puan' })
    const body = screen.getByRole('textbox', { name: 'Yorum' })
    expect(ratingGroup).toHaveAttribute('aria-invalid', 'true')
    expect(ratingGroup).toHaveAttribute('aria-describedby', ratingError.id)
    expect(body).toHaveAttribute('aria-invalid', 'true')
    expect(body).toHaveAttribute('aria-describedby', bodyError.id)
    expect(requests('/comments/add')).toHaveLength(0)
  })
  it('seçilen yıldızı işaretler ve yorumu DummyJSON’a gönderir', async () => {
    const u = userEvent.setup()
    show()
    await u.click(screen.getByRole('button', { name: '4 yıldız' }))
    expect(screen.getByRole('button', { name: '4 yıldız' })).toHaveAttribute('aria-pressed', 'true')
    await u.type(screen.getByRole('textbox', { name: 'Yorum' }), 'Dövüş Kulübü harika')
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    await waitFor(() => expect(screen.getByText('Yorum kaydedildi')).toBeInTheDocument())
    expect(requests('/comments/add')).toHaveLength(1)
    expect(requests('/comments/add')[0].method).toBe('POST')
  })
})
