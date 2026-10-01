import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PosterFrame } from '@exercise/PosterFrame'
describe('PosterFrame', () => {
  it('JSX çocuk içeriği gösterir', () => {
    render(
      <PosterFrame>
        <strong>Dövüş Kulübü</strong>
      </PosterFrame>,
    )
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
  })
  it('caption verilmezse boş afiş mesajı gösterir', () => {
    render(<PosterFrame>Poster</PosterFrame>)
    expect(screen.getByText('Afiş yok')).toBeInTheDocument()
  })
  it('verilen caption metnini gösterir', () => {
    render(<PosterFrame caption="Matrix afişi">Poster</PosterFrame>)
    expect(screen.getByText('Matrix afişi')).toBeInTheDocument()
  })
})
