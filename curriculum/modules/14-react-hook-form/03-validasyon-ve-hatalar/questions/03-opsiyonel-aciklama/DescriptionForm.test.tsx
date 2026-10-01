import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DescriptionForm } from '@exercise/DescriptionForm'

describe('opsiyonel açıklama', () => {
  it('boş ad için hata gösterir', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<DescriptionForm onSave={s} />)
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Ad gerekli')
    expect(screen.getByLabelText('Liste adı')).toHaveAttribute('aria-invalid', 'true')
    expect(s).not.toHaveBeenCalled()
  })
  it('boş açıklamayı kabul eder', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<DescriptionForm onSave={s} />)
    await u.type(screen.getByLabelText('Liste adı'), 'Akşam')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(s.mock.calls[0]?.[0]).toEqual({ name: 'Akşam', description: '' })
    expect(screen.getByLabelText('Liste adı')).not.toHaveAttribute('aria-invalid', 'true')
  })
  it('121 karakteri reddeder, 120 karakteri kabul eder', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<DescriptionForm onSave={s} />)
    await u.type(screen.getByLabelText('Liste adı'), 'Akşam')
    await u.type(screen.getByLabelText('Açıklama'), 'a'.repeat(121))
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Açıklama en çok 120 karakter')
    expect(screen.getByLabelText('Açıklama')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Açıklama')).toHaveAttribute(
      'aria-describedby',
      screen.getByRole('alert').id,
    )
    expect(s).not.toHaveBeenCalled()
    await u.clear(screen.getByLabelText('Açıklama'))
    await u.type(screen.getByLabelText('Açıklama'), 'b'.repeat(120))
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(s.mock.calls[0]?.[0].description).toHaveLength(120)
  })
})
