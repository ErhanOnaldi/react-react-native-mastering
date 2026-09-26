import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieWorkspace } from '@exercise/MovieWorkspace'

describe('film çalışma alanı', () => {
  it('tür seçimi URL’de kalır, favori işareti tür değişip geri dönünce korunur', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([{ path: '/workspace', element: <MovieWorkspace /> }], {
      initialEntries: ['/workspace?genre=28&page=1'],
    })
    render(<RouterProvider router={router} />)

    const firstTitle = await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')
    expect(firstTitle).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Örümcek-Adam: Yepyeni Bir Gün favori' }))
    expect(
      screen.getByRole('button', { name: 'Örümcek-Adam: Yepyeni Bir Gün favori' }),
    ).toHaveAttribute('aria-pressed', 'true')

    await user.selectOptions(screen.getByRole('combobox', { name: 'Tür' }), '35')
    expect(await screen.findByText("Coyote Acme'ye Karşı")).toBeInTheDocument()
    expect(router.state.location.search).toContain('page=1')

    await router.navigate(-1)
    expect(await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Tür' })).toHaveValue('28')
    expect(
      screen.getByRole('button', { name: 'Örümcek-Adam: Yepyeni Bir Gün favori' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('sonraki sayfa URL’e yansır ve doğru sayfa isteği gönderilir', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([{ path: '/workspace', element: <MovieWorkspace /> }], {
      initialEntries: ['/workspace?genre=28&page=1'],
    })
    render(<RouterProvider router={router} />)

    await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')
    await user.click(screen.getByRole('button', { name: 'Sonraki sayfa' }))
    expect(router.state.location.search).toContain('page=2')
    expect(
      requests('/3/discover/movie').some(
        (request) =>
          request.search.get('with_genres') === '28' && request.search.get('page') === '2',
      ),
    ).toBe(true)
  })
})
