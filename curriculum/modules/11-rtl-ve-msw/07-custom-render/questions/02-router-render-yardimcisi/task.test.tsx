import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useParams } from 'react-router'
import { renderWithRouter } from '@exercise/renderWithRouter'
function MovieId() {
  const { id } = useParams()
  return <h1>Film {id}</h1>
}
describe('renderWithRouter', () => {
  it('route parametresini bileşene aktarır', () => {
    const { router } = renderWithRouter(<MovieId />, { path: '/movie/:id', route: '/movie/550' })
    expect(screen.getByRole('heading', { name: 'Film 550' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/movie/550')
  })
})
