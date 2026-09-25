import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ManualWatchlistForm } from '@exercise/ManualWatchlistForm'

describe('sekiz alanlı controlled form', () => {
  it('sekiz etiketli alanı gösterir ve yazarken render sayısı artar', async () => {
    const user = userEvent.setup()
    render(<ManualWatchlistForm onSave={vi.fn()} />)
    for (const label of [
      'Liste adı',
      'Açıklama',
      'Kapak',
      'İlk film',
      'Etiket',
      'Renk',
      'Sıra',
      'Not',
    ])
      expect(screen.getByLabelText(label)).toBeInTheDocument()
    const before = Number(screen.getByRole('status', { name: 'Render sayısı' }).textContent)
    await user.type(screen.getByRole('textbox', { name: 'Liste adı' }), 'A')
    const after = Number(screen.getByRole('status', { name: 'Render sayısı' }).textContent)
    expect(after).toBeGreaterThan(before)
  })
  it('boş ve kısa liste adında kaydetmez, açıklayıcı hata gösterir', async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    render(<ManualWatchlistForm onSave={save} />)
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Liste adı gerekli')
    await user.type(screen.getByLabelText('Liste adı'), 'AB')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Liste adı en az 3 karakter olmalı')
    expect(save).not.toHaveBeenCalled()
  })
  it('ilk film zorunludur ve geçerli formda sekiz alanı gönderir', async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    render(<ManualWatchlistForm onSave={save} />)
    await user.type(screen.getByLabelText('Liste adı'), 'Akşam')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('İlk film gerekli')
    await user.type(screen.getByLabelText('İlk film'), 'Dövüş Kulübü')
    await user.type(screen.getByLabelText('Not'), 'Arkadaşlarla')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(save).toHaveBeenCalledWith({
      name: 'Akşam',
      description: '',
      cover: '',
      firstMovie: 'Dövüş Kulübü',
      tag: '',
      color: '',
      sort: '',
      note: 'Arkadaşlarla',
    })
  })
})
