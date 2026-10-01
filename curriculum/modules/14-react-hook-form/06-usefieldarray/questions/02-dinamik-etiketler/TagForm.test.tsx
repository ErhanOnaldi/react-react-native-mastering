import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TagForm } from '@exercise/TagForm'

describe('dinamik etiketler', () => {
  it('yeni etiket ekler ve iki değeri gönderir', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<TagForm onSave={s} />)
    await u.type(screen.getByRole('textbox', { name: 'Etiket 1' }), 'klasik')
    await u.click(screen.getByRole('button', { name: 'Etiket ekle' }))
    await u.type(screen.getByRole('textbox', { name: 'Etiket 2' }), 'aksiyon')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(s.mock.calls[0]?.[0]).toEqual({ tags: [{ value: 'klasik' }, { value: 'aksiyon' }] })
  })
  it('ortadaki etiketi silince kalan değerler yer değiştirmez', async () => {
    const u = userEvent.setup(),
      s = vi.fn()
    render(<TagForm onSave={s} />)
    await u.type(screen.getByLabelText('Etiket 1'), 'ilk')
    await u.click(screen.getByRole('button', { name: 'Etiket ekle' }))
    await u.type(screen.getByLabelText('Etiket 2'), 'orta')
    await u.click(screen.getByRole('button', { name: 'Etiket ekle' }))
    await u.type(screen.getByLabelText('Etiket 3'), 'son')
    await u.click(screen.getByRole('button', { name: 'Etiket 2 sil' }))
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(s.mock.calls[0]?.[0]).toEqual({ tags: [{ value: 'ilk' }, { value: 'son' }] })
  })
})
