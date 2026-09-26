import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MovieShelf } from '@exercise/MovieShelf'

const ascending = [
  "Coyote Acme'ye Karşı",
  "Oak Caddesi'nin Sonu",
  'Örümcek-Adam: Yepyeni Bir Gün',
  'Resident Evil',
]

function titles() {
  return screen.getAllByRole('listitem').map((item) => item.textContent?.replace(' Favori', ''))
}

describe('film rafı', () => {
  it('popüler filmleri Türkçe başlık sırasıyla gösterir ve sırayı tersine çevirebilir', async () => {
    render(<MovieShelf />)
    expect(titles()).toEqual(ascending)
    await userEvent.click(screen.getByRole('button', { name: 'Sıralamayı ters çevir' }))
    expect(titles()).toEqual([...ascending].reverse())
  })

  it('iki farklı favori sıralama değişince aynı filmlerde kalır ve çıkarılabilir', async () => {
    render(<MovieShelf />)
    const resident = screen.getByRole('button', { name: 'Resident Evil favori' })
    const coyote = screen.getByRole('button', { name: "Coyote Acme'ye Karşı favori" })
    await userEvent.click(resident)
    await userEvent.click(coyote)
    await userEvent.click(screen.getByRole('button', { name: 'Sıralamayı ters çevir' }))
    expect(resident).toHaveAttribute('aria-pressed', 'true')
    expect(coyote).toHaveAttribute('aria-pressed', 'true')
    expect(within(screen.getAllByRole('listitem')[0]).getByRole('button')).toBe(resident)
    await userEvent.click(resident)
    expect(resident).toHaveAttribute('aria-pressed', 'false')
    expect(coyote).toHaveAttribute('aria-pressed', 'true')
  })
})
