import { render, screen } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { VirtualMovieList } from '@project/src/features/movies/components/VirtualMovieList'

const movies = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  title: i === 249 ? 'Dövüş Kulübü' : `Film ${i + 1}`,
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

describe('Sinema büyük film listesi', () => {
  it('500 filmde 30 dan az gerçek DOM satırı tutar', () => {
    render(<VirtualMovieList movies={movies} query="" />)
    const count = screen.getAllByRole('listitem').length
    expect(count, `Beklenen: 30'dan az DOM satırı; bulunan: ${count}`).toBeLessThan(30)
  })
  it('filtre değişince gerçek film başlığını gösterir', () => {
    render(<VirtualMovieList movies={movies} query="Dövüş" />)
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
