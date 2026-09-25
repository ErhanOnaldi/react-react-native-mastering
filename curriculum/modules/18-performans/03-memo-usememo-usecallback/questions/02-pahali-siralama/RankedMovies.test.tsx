import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RankedMovies } from '@exercise/RankedMovies'
import type { Movie } from '@exercise/RankedMovies'

const a: Movie[] = [
  { id: 550, title: 'Dövüş Kulübü', score: 8 },
  { id: 603, title: 'Matrix', score: 9 },
]
const rank = vi.fn((items: Movie[]) => [...items].sort((x, y) => y.score - x.score))
describe('RankedMovies', () => {
  it('puan sırasını gösterir ve giriş dizisini değiştirmez', () => {
    render(<RankedMovies movies={a} theme="dark" rank={rank} />)
    expect(screen.getAllByRole('listitem').map((x) => x.textContent)).toEqual([
      'Matrix',
      'Dövüş Kulübü',
    ])
    expect(a[0].id).toBe(550)
  })
  it('yalnız tema değişince pahalı sıralamayı tekrar çalıştırmaz', () => {
    const view = render(<RankedMovies movies={a} theme="dark" rank={rank} />)
    const before = rank.mock.calls.length
    view.rerender(<RankedMovies movies={a} theme="light" rank={rank} />)
    expect(rank).toHaveBeenCalledTimes(before)
  })
  it('film dizisi değişince sıralamayı yeniden hesaplar', () => {
    const view = render(<RankedMovies movies={a} theme="dark" rank={rank} />)
    const before = rank.mock.calls.length
    view.rerender(
      <RankedMovies
        movies={[...a, { id: 155, title: 'Kara Şövalye', score: 10 }]}
        theme="dark"
        rank={rank}
      />,
    )
    expect(rank).toHaveBeenCalledTimes(before + 1)
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Kara Şövalye')
  })
})
