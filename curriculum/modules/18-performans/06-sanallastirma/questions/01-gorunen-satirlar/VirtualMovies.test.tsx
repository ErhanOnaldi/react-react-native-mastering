import { render, screen } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { VirtualMovies } from '@exercise/VirtualMovies'
const movies = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  title: i === 0 ? 'Dövüş Kulübü' : `Film ${i + 1}`,
}))
let height: ReturnType<typeof vi.spyOn>
let width: ReturnType<typeof vi.spyOn>
beforeAll(() => {
  height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(240)
  width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(320)
})
afterAll(() => {
  height.mockRestore()
  width.mockRestore()
})

describe('VirtualMovies', () => {
  it('500 film için yalnız görünür satırları DOM içine koyar', () => {
    render(<VirtualMovies movies={movies} />)
    const rows = screen.getAllByRole('listitem')
    expect(
      rows.length,
      `Beklenen: 500 film için 30'dan az DOM satırı; bulunan: ${rows.length}`,
    ).toBeLessThan(30)
    expect(rows.length).toBeGreaterThan(0)
  })
  it('ilk filmin gerçek başlığını gösterir ve toplam kaydırma alanını korur', () => {
    render(<VirtualMovies movies={movies} />)
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
    const list = screen.getByRole('list') as HTMLElement
    expect(Number.parseFloat(list.style.height)).toBeGreaterThan(10000)
  })
})
