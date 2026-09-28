import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { FavoritesProvider } from '@project/src/context/FavoritesContext'
import { routes } from '@project/src/router'

function open(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>,
  )
  return router
}

describe('canlı film detayı ve favoriler', () => {
  it('550 detayında Türkçe başlığı ve oyuncu kadrosunu gösterir', async () => {
    open('/movie/550')
    expect(
      await screen.findByRole('heading', { name: 'Dövüş Kulübü' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Brad Pitt/)).toBeInTheDocument()
    expect(requests('/3/movie/550')[0]?.search.get('append_to_response')).toBe('credits,videos')
  })
  it('geçersiz id için istek atmadan hata gösterir', () => {
    open('/movie/abc')
    expect(screen.getByRole('alert')).toHaveTextContent(/geçersiz film adresi/i)
    expect(requests(/\/3\/movie\/abc/)).toHaveLength(0)
  })
  it('favori filmi statik liste yerine TMDB detayından gösterir', async () => {
    const router = open('/movie/550')
    await screen.findByRole('heading', { name: 'Dövüş Kulübü' }, { timeout: 4000 })
    await userEvent.click(screen.getByRole('button', { name: 'Favoriye ekle' }))
    await router.navigate('/favorites')
    expect(
      await screen.findByRole('link', { name: 'Dövüş Kulübü' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    // Sayıyı gözlemliyoruz; ileride cache eklenmesi bu davranış testini kırmamalı.
    const detailRequests = requests('/3/movie/550').length
    expect(detailRequests).toBeGreaterThan(0)
  })
})
