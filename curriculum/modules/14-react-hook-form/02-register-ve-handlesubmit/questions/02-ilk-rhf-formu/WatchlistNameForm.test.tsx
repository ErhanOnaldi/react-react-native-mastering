import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WatchlistNameForm } from '@exercise/WatchlistNameForm'

describe('ilk RHF formu', () => {
  it('etiketli alanlara yazılan verileri gönderir', async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    render(<WatchlistNameForm onSave={save} />)
    await user.type(screen.getByRole('textbox', { name: 'Liste adı' }), 'Akşam')
    await user.type(screen.getByLabelText('Açıklama'), 'Kısa filmler')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(save).toHaveBeenCalledWith(
      { name: 'Akşam', description: 'Kısa filmler' },
      expect.anything(),
    )
  })
  it('yeni formda önceki formun değerlerini taşımaz', async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    render(<WatchlistNameForm onSave={save} />)
    await user.type(screen.getByLabelText('Liste adı'), 'Yeni')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(save.mock.calls[0]?.[0]).toEqual({ name: 'Yeni', description: '' })
  })
})
