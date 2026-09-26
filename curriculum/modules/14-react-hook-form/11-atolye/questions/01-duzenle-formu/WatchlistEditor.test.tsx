import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WatchlistEditor } from '@exercise/WatchlistEditor'
import { watchlists } from '@exercise/watchlists'

describe('izleme listesi düzenleyici', () => {
  it('liste değişince alanları yeni listenin değerleriyle gösterir', () => {
    const { rerender } = render(<WatchlistEditor list={watchlists[0]} onSave={vi.fn()} />)
    expect(screen.getByLabelText('Liste adı')).toHaveValue(watchlists[0].name)
    expect(screen.getByLabelText('Açıklama')).toHaveValue(watchlists[0].description)

    rerender(<WatchlistEditor list={watchlists[1]} onSave={vi.fn()} />)
    expect(screen.getByLabelText('Liste adı')).toHaveValue(watchlists[1].name)
    expect(screen.getByLabelText('Açıklama')).toHaveValue(watchlists[1].description)
  })

  it('değişmemiş formu göndermez, değişikliği güncel değerle iletir', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<WatchlistEditor list={watchlists[0]} onSave={onSave} />)

    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(onSave).not.toHaveBeenCalled()

    await user.clear(screen.getByLabelText('Liste adı'))
    await user.type(screen.getByLabelText('Liste adı'), 'Cuma Gecesi')
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(onSave).toHaveBeenCalledWith({
      name: 'Cuma Gecesi',
      description: watchlists[0].description,
    })
  })

  it('kaydettikten sonra aynı liste için tekrar devre dışı kalır', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<WatchlistEditor list={watchlists[0]} onSave={onSave} />)

    await user.clear(screen.getByLabelText('Açıklama'))
    await user.type(screen.getByLabelText('Açıklama'), 'Yeni açıklama')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled()
  })
})
