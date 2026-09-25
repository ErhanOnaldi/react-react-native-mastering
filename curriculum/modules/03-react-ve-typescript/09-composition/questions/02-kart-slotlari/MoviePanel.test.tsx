import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MoviePanel } from '@exercise/MoviePanel'
describe('MoviePanel', () => {
  it('çocuk içeriği article içinde gösterir', () => {
    render(
      <MoviePanel>
        <h2>Matrix</h2>
      </MoviePanel>,
    )
    expect(screen.getByRole('article')).toContainElement(
      screen.getByRole('heading', { name: 'Matrix' }),
    )
    expect(screen.getByRole('article').querySelector('footer')).toBeNull()
  })
  it('verilen eylemi footer içinde gösterir', () => {
    render(<MoviePanel actions={<button>Favoriye ekle</button>}>Film</MoviePanel>)
    expect(screen.getByRole('button', { name: 'Favoriye ekle' })).toBeInTheDocument()
    expect(screen.getByRole('article').querySelector('footer')).toContainElement(
      screen.getByRole('button'),
    )
  })
  it('sayı sıfır olan actions içeriğini kaybetmez', () => {
    render(<MoviePanel actions={0}>Film</MoviePanel>)
    expect(screen.getByRole('article').querySelector('footer')).toHaveTextContent('0')
  })
})
