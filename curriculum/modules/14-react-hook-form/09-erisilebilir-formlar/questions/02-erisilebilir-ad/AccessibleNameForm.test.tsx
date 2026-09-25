import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AccessibleNameForm } from '@exercise/AccessibleNameForm'

describe('erişilebilir ad alanı', () => {
  it('etiketli alanı hata mesajına bağlar', async () => {
    const u = userEvent.setup()
    render(<AccessibleNameForm onSave={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: 'Liste adı' })
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    const alert = screen.getByRole('alert')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', alert.id)
    expect(alert).toHaveTextContent('Ad gerekli')
  })
  it('geçerli adla kaydeder', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<AccessibleNameForm onSave={s} />)
    await u.type(screen.getByLabelText('Liste adı'), 'Akşam')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(s.mock.calls[0]?.[0]).toEqual({ name: 'Akşam' })
  })
})
