import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieSummary } from '@exercise/MovieSummary'
import { MoviePoster } from '@exercise/MoviePoster'

describe('detay görünümü refactor', () => {
  it('posterli filmde başlık, açıklama ve görseli gösterir', () => {
    render(
      <MovieSummary
        movie={{ title: 'Dövüş Kulübü', overview: 'Bir kulüp.', poster_path: '/poster.jpg' }}
      />,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Dövüş Kulübü' })).toBeInTheDocument()
    expect(screen.getByText('Bir kulüp.')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Dövüş Kulübü' })).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w185/poster.jpg',
    )
  })
  it('postersiz filmde kırık görsel göstermez', () => {
    render(<MovieSummary movie={{ title: 'Matrix', overview: 'Bir dünya.', poster_path: null }} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Matrix' })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
  it('ayrılan poster bileşeni görseli ve eksik poster durumunu yönetir', () => {
    const { rerender } = render(<MoviePoster title="Matrix" path="/matrix.jpg" />)
    expect(screen.getByRole('img', { name: 'Matrix' })).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w185/matrix.jpg',
    )
    rerender(<MoviePoster title="Matrix" path={null} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
