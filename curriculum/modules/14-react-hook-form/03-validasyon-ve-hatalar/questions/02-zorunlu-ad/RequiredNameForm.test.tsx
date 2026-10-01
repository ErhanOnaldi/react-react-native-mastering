import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RequiredNameForm } from '@exercise/RequiredNameForm'

describe('isim kuralları', () => {
  it('boş ismi reddeder ve nedenini gösterir', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<RequiredNameForm onSave={s} />)
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Ad gerekli')
    expect(screen.getByLabelText('Liste adı')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Liste adı')).toHaveAttribute(
      'aria-describedby',
      screen.getByRole('alert').id,
    )
    expect(s).not.toHaveBeenCalled()
  })
  it('iki karakteri reddeder, üç karakteri kabul eder', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<RequiredNameForm onSave={s} />)
    await u.type(screen.getByLabelText('Liste adı'), 'AB')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('En az 3 karakter')
    await u.type(screen.getByLabelText('Liste adı'), 'C')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(s.mock.calls[0]?.[0]).toEqual({ name: 'ABC' })
    expect(screen.getByLabelText('Liste adı')).not.toHaveAttribute('aria-invalid', 'true')
  })
})
