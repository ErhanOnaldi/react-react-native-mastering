import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieHeading } from '@exercise/MovieHeading'
describe('MovieHeading', () => {
  it('film başlığını heading olarak gösterir', () => {
    render(<MovieHeading title="Matrix" year="1999" />)
    expect(screen.getByRole('heading', { name: 'Matrix' })).toBeInTheDocument()
  })
  it('yılı gösterir, boş yılı göstermez', () => {
    const { rerender } = render(<MovieHeading title="Matrix" year="1999" />)
    expect(screen.getByText('1999')).toBeInTheDocument()
    rerender(<MovieHeading title="Dövüş Kulübü" year="" />)
    expect(screen.queryByText('1999')).not.toBeInTheDocument()
  })
})
