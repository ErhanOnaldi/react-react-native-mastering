import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { sampleMovies } from '@project/src/data/sample-movies'
import { MovieCard } from '@project/src/components/MovieCard'
import { MovieGrid } from '@project/src/components/MovieGrid'
import { SearchBox } from '@project/src/components/SearchBox'

describe('Sinema statik bileşenleri', () => {
  it('fixture kökenli farklı filmleri tipli örnek listede sunar', () => {
    expect(sampleMovies.length).toBeGreaterThanOrEqual(10)
    expect(sampleMovies.length).toBeLessThanOrEqual(14)
    expect(new Set(sampleMovies.map((movie) => movie.id)).size).toBe(sampleMovies.length)
    expect(sampleMovies.map((movie) => movie.id)).toEqual(expect.arrayContaining([550, 155, 603]))
  })
  it('kart film başlığını ve favori durumunu gösterir', () => {
    const movie = sampleMovies.find((item) => item.id === 550)!
    render(<MovieCard movie={movie} isFavorite={true} onToggleFavorite={() => {}} />)
    expect(screen.getByText(movie.title)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Dövüş Kulübü.*favoriden çıkar/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
  it('kart tıklanınca doğru film id’sini bildirir', async () => {
    const user = userEvent.setup()
    const toggle = vi.fn()
    const movie = sampleMovies.find((item) => item.id === 155)!
    render(<MovieCard movie={movie} isFavorite={false} onToggleFavorite={toggle} />)
    await user.click(screen.getByRole('button', { name: /Kara Şövalye.*favoriye ekle/i }))
    expect(toggle).toHaveBeenCalledWith(155)
  })
  it('grid her filmi gösterir ve boş listeyi açıklar', () => {
    const { rerender } = render(
      <MovieGrid movies={sampleMovies.slice(0, 2)} favoriteIds={[]} onToggleFavorite={() => {}} />,
    )
    expect(screen.getAllByRole('button', { name: /favoriye ekle/i })).toHaveLength(2)
    rerender(<MovieGrid movies={[]} favoriteIds={[]} onToggleFavorite={() => {}} />)
    expect(screen.getByText('Film bulunamadı')).toBeInTheDocument()
  })
  it('arama kutusu kontrollü değeri gösterir ve yazıyı bildirir', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    render(<SearchBox value="" onChange={change} />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'M')
    expect(change).toHaveBeenCalledWith('M')
  })
})
