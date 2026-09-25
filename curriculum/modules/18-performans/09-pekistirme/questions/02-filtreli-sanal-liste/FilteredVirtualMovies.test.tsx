import { render, screen } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { FilteredVirtualMovies } from '@exercise/FilteredVirtualMovies'
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

describe('FilteredVirtualMovies', () => {
  it('boş sorguda 500 film için 30 dan az DOM satırı tutar', () => {
    render(<FilteredVirtualMovies movies={movies} query="" />)
    expect(screen.getAllByRole('listitem').length).toBeLessThan(30)
  })
  it('sorgu değişince filtrelenen film görünür ve eski satırlar kalkar', () => {
    const view = render(<FilteredVirtualMovies movies={movies} query="Film" />)
    view.rerender(<FilteredVirtualMovies movies={movies} query="Dövüş" />)
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
  })
})
