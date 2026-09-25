import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProfiledMovies } from '@exercise/ProfiledMovies'

describe('ProfiledMovies', () => {
  it('ilk commit için movie-list kimliğini bildirir', () => {
    const onCommit = vi.fn()
    render(<ProfiledMovies titles={['Dövüş Kulübü']} onCommit={onCommit} />)
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(onCommit).toHaveBeenCalledWith(
      'movie-list',
      'mount',
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
    )
  })
  it('liste değişince bir update commit bildirir', () => {
    const onCommit = vi.fn()
    const view = render(<ProfiledMovies titles={['Matrix']} onCommit={onCommit} />)
    const before = onCommit.mock.calls.length
    view.rerender(<ProfiledMovies titles={['Matrix', 'Başlangıç']} onCommit={onCommit} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(onCommit.mock.calls.slice(before).some((call) => call[1] === 'update')).toBe(true)
  })
})
