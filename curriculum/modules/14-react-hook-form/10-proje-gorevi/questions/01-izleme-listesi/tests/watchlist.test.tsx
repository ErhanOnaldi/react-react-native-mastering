import { render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { WatchlistForm } from '@project/src/features/watchlists/WatchlistForm'
import { useWatchlists } from '@project/src/features/watchlists/useWatchlists'

beforeEach(() => localStorage.clear())
describe('Sinema izleme listeleri', () => {
  it('boş adı reddeder ve yerel depoya liste eklemez', async () => {
    const u = userEvent.setup()
    render(<WatchlistForm />)
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Ad gerekli')
    expect(localStorage.getItem('sinema:watchlists')).toBeNull()
  })
  it('adı, açıklamayı, görünürlüğü ve dinamik etiketleri saklar', async () => {
    const u = userEvent.setup()
    const { result } = renderHook(() => useWatchlists())
    render(<WatchlistForm />)
    await u.type(screen.getByRole('textbox', { name: 'Liste adı' }), 'Hafta sonu')
    await u.type(screen.getByRole('textbox', { name: 'Açıklama' }), 'Kısa liste')
    await u.click(screen.getByRole('checkbox', { name: 'Herkese açık' }))
    await u.type(screen.getByRole('textbox', { name: 'Etiket 1' }), 'klasik')
    await u.click(screen.getByRole('button', { name: 'Etiket ekle' }))
    await u.type(screen.getByRole('textbox', { name: 'Etiket 2' }), 'arkadaşlar')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem('sinema:watchlists') ?? '[]')).toHaveLength(1),
    )
    expect(screen.getByRole('status')).toHaveTextContent('Liste kaydedildi')
    const saved = JSON.parse(localStorage.getItem('sinema:watchlists') ?? '[]')[0]
    expect(saved).toMatchObject({
      name: 'Hafta sonu',
      description: 'Kısa liste',
      isPublic: true,
      tags: [{ value: 'klasik' }, { value: 'arkadaşlar' }],
    })
    expect(saved.id).toEqual(expect.any(String))
    expect(new Date(saved.createdAt).toISOString()).toBe(saved.createdAt)
    expect(result.current.watchlists).toHaveLength(1)

    await u.type(screen.getByRole('textbox', { name: 'Liste adı' }), 'Başka hafta')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem('sinema:watchlists') ?? '[]')).toHaveLength(2),
    )
    const savedAgain = JSON.parse(localStorage.getItem('sinema:watchlists') ?? '[]')[1]
    expect(savedAgain.id).not.toBe(saved.id)
    expect(result.current.watchlists).toHaveLength(2)
  })
  it('etiket silindiğinde saklanan dizi yalnızca kalan satırları içerir', async () => {
    const u = userEvent.setup()
    render(<WatchlistForm />)
    await u.type(screen.getByRole('textbox', { name: 'Liste adı' }), 'Akşam')
    await u.type(screen.getByRole('textbox', { name: 'Etiket 1' }), 'ilk')
    await u.click(screen.getByRole('button', { name: 'Etiket ekle' }))
    await u.type(screen.getByRole('textbox', { name: 'Etiket 2' }), 'son')
    await u.click(screen.getByRole('button', { name: 'Etiket 1 sil' }))
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem('sinema:watchlists') ?? '[]')).toHaveLength(1),
    )
    expect(JSON.parse(localStorage.getItem('sinema:watchlists') ?? '[]')[0].tags).toEqual([
      { value: 'son' },
    ])
  })
  it('hook daha önce saklanan listeleri yeniden okur', () => {
    localStorage.setItem(
      'sinema:watchlists',
      JSON.stringify([
        {
          id: '1',
          createdAt: '2026-09-25T00:00:00.000Z',
          name: 'Akşam',
          description: '',
          isPublic: false,
          tags: [],
        },
      ]),
    )
    const { result } = renderHook(() => useWatchlists())
    expect(result.current.watchlists).toHaveLength(1)
    expect(result.current.watchlists[0].name).toBe('Akşam')
  })
})
