import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render'
import { READING_LIST_STORAGE_KEY } from './storage'

describe('Okuma listesi', () => {
  it('detay sayfasından eklenen kitap menüde sayılır ve kalıcı olur', async () => {
    const { user } = renderApp('/works/OL893414W')
    await screen.findByRole('heading', { level: 1, name: 'Dune' })
    await user.selectOptions(screen.getByLabelText('Durum'), 'Okuyorum')
    await user.click(screen.getByRole('button', { name: 'Listeye ekle' }))

    expect(await screen.findByRole('link', { name: 'Okuma listem (1)' })).toBeInTheDocument()
    expect(localStorage.getItem(READING_LIST_STORAGE_KEY)).toContain('OL893414W')
    expect(screen.getByRole('button', { name: 'Güncelle' })).toBeInTheDocument()
  })

  it('"Okudum" seçilince puan ister, uzun notu reddeder', async () => {
    const { user } = renderApp('/works/OL893414W')
    await screen.findByRole('heading', { level: 1, name: 'Dune' })
    await user.selectOptions(screen.getByLabelText('Durum'), 'Okudum')
    await user.click(screen.getByLabelText('Not'))
    await user.paste('a'.repeat(281))
    await user.click(screen.getByRole('button', { name: 'Listeye ekle' }))

    expect(await screen.findByText('Okuduğun kitaba 1–5 arası puan ver.')).toBeInTheDocument()
    expect(screen.getByText('Not en fazla 280 karakter olabilir.')).toBeInTheDocument()
    expect(localStorage.getItem(READING_LIST_STORAGE_KEY)).toBe('[]')
  })

  it('liste sayfasında duruma göre süzer ve kitabı çıkarır', async () => {
    const { user, router } = renderApp('/works/OL893414W')
    await screen.findByRole('heading', { level: 1, name: 'Dune' })
    await user.selectOptions(screen.getByLabelText('Durum'), 'Okudum')
    await user.selectOptions(screen.getByLabelText('Puan'), '5')
    await user.click(screen.getByRole('button', { name: 'Listeye ekle' }))

    await router.navigate('/works/OL24252290W')
    await screen.findByRole('heading', { level: 1, name: 'Suç ve Ceza' })
    await user.click(screen.getByRole('button', { name: 'Listeye ekle' }))

    await router.navigate('/reading-list?status=read')
    const list = await screen.findByRole('list')
    expect(within(list).getByRole('link', { name: 'Dune' })).toBeInTheDocument()
    expect(within(list).queryByRole('link', { name: 'Suç ve Ceza' })).not.toBeInTheDocument()
    expect(within(list).getByText(/Puan: 5\/5/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Dune kitabını listeden çıkar' }))
    expect(screen.getByText('Bu durumda kitap yok.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Okuma listem (1)' })).toBeInTheDocument()
  })
})
