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

describe('tür filtresi ve sayfalama', () => {
  it('türlü URL’de keşfet endpointinden Aksiyon filmlerini getirir', async () => {
    open('/?genre=28')
    await screen.findByRole('option', { name: 'Aksiyon' })
    expect((screen.getByRole('combobox', { name: /tür seç/i }) as HTMLSelectElement).value).toBe(
      '28',
    )
    expect(await screen.findByText(/Sayfa 1/)).toBeInTheDocument()
    expect(requests('/3/discover/movie')[0]?.search.get('with_genres')).toBe('28')
    expect(requests('/3/genre/movie/list').length).toBeGreaterThan(0)
  })
  it('sonraki sayfa URL’yi ve istek parametresini değiştirir', async () => {
    const router = open('/?genre=28')
    await screen.findByRole('button', { name: 'Sonraki' })
    await userEvent.click(screen.getByRole('button', { name: 'Sonraki' }))
    expect(new URLSearchParams(router.state.location.search).get('page')).toBe('2')
    expect(await screen.findByText(/Sayfa 2/)).toBeInTheDocument()
    expect(requests('/3/discover/movie').some((item) => item.search.get('page') === '2')).toBe(true)
  })
  it('tür değişince önceki sayfayı sıfırlar', async () => {
    const router = open('/?genre=28&page=2')
    await screen.findByRole('option', { name: 'Komedi' })
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /tür seç/i }), '35')
    const params = new URLSearchParams(router.state.location.search)
    expect(params.get('genre')).toBe('35')
    expect(params.has('page')).toBe(false)
  })
})
