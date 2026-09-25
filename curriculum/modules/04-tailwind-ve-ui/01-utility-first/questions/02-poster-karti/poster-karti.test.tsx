import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PosterTile } from '@exercise/PosterTile'

describe('PosterTile', () => {
  it('film başlığını ve puanını ayrı öğelerde gösterir', () => {
    render(<PosterTile title="Dövüş Kulübü" score="8.4" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Dövüş Kulübü' })).toBeInTheDocument()
    expect(screen.getByText('8.4')).toBeInTheDocument()
  })
  it('kart sınırı ve iç boşluk utility’lerini uygular', () => {
    const { container } = render(<PosterTile title="Başlangıç" score="8.1" />)
    expect(container.querySelector('article')).toHaveClass('rounded-xl', 'border', 'p-4')
  })
  it('başlık ve puanı farklı tipografi ile gösterir', () => {
    render(<PosterTile title="Matrix" score="8.2" />)
    expect(screen.getByRole('heading', { name: 'Matrix' })).toHaveClass('font-semibold')
    expect(screen.getByText('8.2')).toHaveClass('text-sm')
  })
})
