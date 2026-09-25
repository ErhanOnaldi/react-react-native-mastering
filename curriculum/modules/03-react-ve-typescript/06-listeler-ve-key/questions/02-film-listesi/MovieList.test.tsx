import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieList } from '@exercise/MovieList'
describe('MovieList', () => {
  it('her filmi ayrı liste öğesinde başlık olarak gösterir', () => {
    render(
      <MovieList
        movies={[
          { id: 550, title: 'Dövüş Kulübü' },
          { id: 603, title: 'Matrix' },
        ]}
      />,
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Matrix' })).toBeInTheDocument()
  })
  it('boş liste için açıklayıcı mesaj verir', () => {
    render(<MovieList movies={[]} />)
    expect(screen.getByText('Film bulunamadı')).toBeInTheDocument()
  })
})
