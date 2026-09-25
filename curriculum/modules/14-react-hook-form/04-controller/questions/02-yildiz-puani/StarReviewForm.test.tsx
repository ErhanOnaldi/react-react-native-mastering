import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StarReviewForm } from '@exercise/StarReviewForm'

describe('özel yıldız girişi', () => {
  it('puan seçilmeden göndermez', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<StarReviewForm onSave={s} />)
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Puan seç')
    expect(s).not.toHaveBeenCalled()
  })
  it('seçilen yıldızı ve metni birlikte gönderir', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<StarReviewForm onSave={s} />)
    await u.click(screen.getByRole('button', { name: '4 yıldız' }))
    expect(screen.getByRole('button', { name: '4 yıldız' })).toHaveAttribute('aria-pressed', 'true')
    await u.type(screen.getByRole('textbox', { name: 'Yorum' }), 'Harika')
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(s.mock.calls[0]?.[0]).toEqual({ rating: 4, body: 'Harika' })
  })
})
