import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WatchlistForm } from '@exercise/WatchlistForm'

describe('Zod bağlı liste formu', () => {
  it('boş adı açıklayıcı hatayla reddeder', async () => {
    const save = vi.fn()
    render(<WatchlistForm onSave={save} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Ad gerekli')
    expect(save).not.toHaveBeenCalled()
  })
  it('başındaki ve sonundaki boşlukları atarak kaydeder', async () => {
    const save = vi.fn()
    render(<WatchlistForm onSave={save} />)
    const u = userEvent.setup()
    await u.type(screen.getByRole('textbox', { name: 'Liste adı' }), '  Klasikler  ')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(save).toHaveBeenCalledWith('Klasikler')
  })
})
