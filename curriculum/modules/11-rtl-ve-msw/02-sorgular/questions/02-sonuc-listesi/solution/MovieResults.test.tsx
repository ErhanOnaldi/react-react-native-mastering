import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieResults } from '@impl/MovieResults'
describe('MovieResults', () => {
  it('filmi erişilebilir başlık olarak gösterir', () => {
    render(<MovieResults movies={[{ id: 603, title: 'Matrix' }]} />)
    expect(screen.getByRole('heading', { name: 'Matrix' })).toBeInTheDocument()
  })
  it('boş sonuçta açıklayıcı mesaj gösterir', () => {
    render(<MovieResults movies={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent('Film bulunamadı')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
