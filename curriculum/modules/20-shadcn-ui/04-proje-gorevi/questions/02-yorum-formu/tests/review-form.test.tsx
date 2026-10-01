import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
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

describe('Sinema yorum formu (shadcn)', () => {
  it('puanı adı olan bir radiogroup olarak sunar', () => {
    show()
    expect(screen.getByRole('radiogroup', { name: 'Puan' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(5)
    expect(screen.getByRole('radio', { name: '1 yıldız' })).not.toBeChecked()
    expect(screen.getByRole('textbox', { name: 'Yorum' })).toBeInTheDocument()
  })

  it('boş gönderimde istek atmaz; hataları görünür yapıp kendi alanlarına bağlar', async () => {
    const user = userEvent.setup()
    show()
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(await screen.findByText('Puan seç')).toBeVisible()
    const group = screen.getByRole('radiogroup', { name: 'Puan' })
    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(group).toHaveAccessibleDescription('Puan seç')
    const body = screen.getByRole('textbox', { name: 'Yorum' })
    expect(body).toHaveAttribute('aria-invalid', 'true')
    expect(body).toHaveAccessibleDescription('Yorum gerekli')
    expect(requests('/comments/add')).toHaveLength(0)
  })

  it('yön tuşları puan seçimini değiştirir', async () => {
    const user = userEvent.setup()
    show()
    await user.click(screen.getByRole('radio', { name: '3 yıldız' }))
    expect(screen.getByRole('radio', { name: '3 yıldız' })).toBeChecked()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '4 yıldız' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '4 yıldız' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: '3 yıldız' })).not.toBeChecked()
  })

  it('geçerli yorumu DummyJSON’a gönderir ve başarıyı duyurur', async () => {
    const user = userEvent.setup()
    show()
    await user.click(screen.getByRole('radio', { name: '4 yıldız' }))
    await user.type(screen.getByRole('textbox', { name: 'Yorum' }), 'Dövüş Kulübü harika')
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(await screen.findByText('Yorum kaydedildi')).toBeInTheDocument()
    expect(requests('/comments/add')).toHaveLength(1)
    expect(requests('/comments/add')[0].method).toBe('POST')
  })
})
