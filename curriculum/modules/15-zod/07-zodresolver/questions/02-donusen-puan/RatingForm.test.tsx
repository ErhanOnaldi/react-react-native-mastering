import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RatingForm } from '@exercise/RatingForm'

describe('dönüşen puan formu', () => {
  it('geçerli input stringini sayı olarak gönderir', async () => {
    const save = vi.fn()
    render(<RatingForm onSave={save} />)
    const u = userEvent.setup()
    await u.type(screen.getByRole('spinbutton', { name: 'Puan' }), '4')
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(save).toHaveBeenCalledWith(4)
  })
  it('alt sınır dışındaki puanı göndermez', async () => {
    const save = vi.fn()
    render(<RatingForm onSave={save} />)
    const u = userEvent.setup()
    await u.type(screen.getByRole('spinbutton', { name: 'Puan' }), '0')
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(save).not.toHaveBeenCalled()
  })
  it('üst sınır dışındaki puanı göndermez', async () => {
    const save = vi.fn()
    render(<RatingForm onSave={save} />)
    const u = userEvent.setup()
    await u.type(screen.getByRole('spinbutton', { name: 'Puan' }), '6')
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(save).not.toHaveBeenCalled()
  })
})
