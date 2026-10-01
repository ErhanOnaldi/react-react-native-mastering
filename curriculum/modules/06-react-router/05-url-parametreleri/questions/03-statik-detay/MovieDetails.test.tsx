import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { MovieDetails } from '@exercise/MovieDetails'

const movies = [
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 603, title: 'Matrix' },
]
function open(path: string) {
  render(
    <RouterProvider
      router={createMemoryRouter(
        [{ path: '/movie/:id', element: <MovieDetails movies={movies} /> }],
        { initialEntries: [path] },
      )}
    />,
  )
}
describe('statik detay', () => {
  it('550 adresinde Dövüş Kulübü başlığını gösterir', () => {
    open('/movie/550')
    expect(screen.getByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
  })
  it('başka id için doğru filmi gösterir', () => {
    open('/movie/603')
    expect(screen.getByRole('heading', { name: 'Matrix' })).toBeInTheDocument()
  })
  it('geçersiz id için açık mesaj gösterir', () => {
    open('/movie/abc')
    expect(screen.getByText('Geçersiz film adresi')).toBeInTheDocument()
  })
  it('listede olmayan sayısal id için bulunamadı mesajı gösterir', () => {
    open('/movie/999')
    expect(screen.getByText('Film bulunamadı')).toBeInTheDocument()
  })
})
