import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DraftEditor, type Draft } from '@exercise/DraftEditor'

const draftA: Draft = { id: 'a', title: 'Taslak A', dueDate: '2026-01-10' }
const draftB: Draft = { id: 'b', title: 'Taslak B', dueDate: '' }

describe('taslak düzenleyici', () => {
  it('başlangıç taslağının değerlerini gösterir', () => {
    render(<DraftEditor draft={draftA} onSave={vi.fn()} />)
    expect(screen.getByLabelText('Başlık')).toHaveValue('Taslak A')
    expect(screen.getByLabelText('Bitiş tarihi')).toHaveValue('2026-01-10')
  })

  it('geçersiz tarih metninde hata gösterir ve göndermez', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<DraftEditor draft={draftB} onSave={onSave} />)

    await user.clear(screen.getByLabelText('Bitiş tarihi'))
    await user.type(screen.getByLabelText('Bitiş tarihi'), 'yarın')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Geçerli bir tarih')
    expect(onSave).not.toHaveBeenCalled()
  })

  it('boş tarihi "tarih yok" olarak kabul edip gönderir', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<DraftEditor draft={draftA} onSave={onSave} />)

    await user.clear(screen.getByLabelText('Bitiş tarihi'))
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))

    expect(onSave).toHaveBeenCalledWith({ title: 'Taslak A', dueDate: undefined })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
