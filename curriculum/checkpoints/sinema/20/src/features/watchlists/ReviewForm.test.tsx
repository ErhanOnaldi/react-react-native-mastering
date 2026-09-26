import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ReviewForm } from './ReviewForm'

function show() {
  const client = new QueryClient()
  return render(
    <QueryClientProvider client={client}>
      <ReviewForm postId={550} />
    </QueryClientProvider>,
  )
}

describe('ReviewForm', () => {
  it('boş gönderimde hataları alanlara bağlar', async () => {
    const user = userEvent.setup()
    show()
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(
      screen.getByRole('radiogroup', { name: 'Puan' }),
    ).toHaveAccessibleDescription('Puan seç')
    expect(
      screen.getByRole('textbox', { name: 'Yorum' }),
    ).toHaveAccessibleDescription('Yorum gerekli')
  })

  it('puanı yön tuşlarıyla değiştirir', async () => {
    const user = userEvent.setup()
    show()
    await user.click(screen.getByRole('radio', { name: '2 yıldız' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '3 yıldız' })).toBeChecked()
  })
})
