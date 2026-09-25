import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PreviousQuery } from '@exercise/PreviousQuery'
describe('PreviousQuery', () => {
  it('ilk renderda önceki sorgu yok der', () => {
    render(<PreviousQuery query="Matrix" />)
    expect(screen.getByText('Önceki: yok')).toBeInTheDocument()
  })
  it('yeni sorgu renderında bir önceki değeri gösterir', () => {
    const view = render(<PreviousQuery query="Matrix" />)
    view.rerender(<PreviousQuery query="Dövüş" />)
    expect(screen.getByText('Önceki: Matrix')).toBeInTheDocument()
  })
})
