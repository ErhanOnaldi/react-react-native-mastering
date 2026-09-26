import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render'

describe('Eser detay sayfası', () => {
  it('eseri, yazarını ve kapağını gösterir', async () => {
    renderApp('/works/OL893414W')
    expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument()
    expect(await screen.findByText('Frank Herbert')).toBeInTheDocument()
    expect(screen.getByText(/desert planet Arrakis/)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Dune/ })).toHaveAttribute(
      'src',
      'https://covers.openlibrary.org/b/id/11481354-L.jpg',
    )
  })

  it('nesne biçimli açıklamayı okur; yazar alınamasa da sayfa çalışır', async () => {
    renderApp('/works/OL24252290W')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Suç ve Ceza' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Raskolnikov’un hikâyesi.')).toBeInTheDocument()
    expect(await screen.findByText('Yazar bilinmiyor')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('olmayan eserde "Kitap bulunamadı" der', async () => {
    renderApp('/works/OL0W')
    expect(await screen.findByRole('heading', { name: 'Kitap bulunamadı' })).toBeInTheDocument()
  })
})
