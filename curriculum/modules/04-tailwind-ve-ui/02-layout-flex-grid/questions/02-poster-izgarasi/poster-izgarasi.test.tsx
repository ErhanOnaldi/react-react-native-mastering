import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PosterGrid } from '@exercise/PosterGrid'
const movies = [
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 27205, title: 'Başlangıç' },
]
describe('PosterGrid', () => {
  it('her filmi ayrı kartta gösterir', () => {
    render(<PosterGrid movies={movies} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText('Başlangıç')).toBeInTheDocument()
  })
  it('mobil ve geniş ekran sütun class’larını taşır', () => {
    render(<PosterGrid movies={movies} />)
    expect(screen.getByRole('region', { name: 'Filmler' })).toHaveClass(
      'grid',
      'grid-cols-2',
      'sm:grid-cols-3',
      'lg:grid-cols-4',
      'gap-4',
    )
  })
  it('uzun başlıklı kartın küçülmesine izin verir', () => {
    render(<PosterGrid movies={movies} />)
    expect(screen.getAllByRole('article')[0]).toHaveClass('min-w-0')
  })
})
