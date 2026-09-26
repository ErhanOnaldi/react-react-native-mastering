import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { SearchWorkspace } from '@exercise/SearchWorkspace'

describe('arama çalışma alanı', () => {
  it('geri ve ileri gezinince URL ile film sonucu aynı aramayı gösterir', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([{ path: '/search', element: <SearchWorkspace /> }], {
      initialEntries: ['/search?q=Matrix&page=1'],
    })
    render(<RouterProvider router={router} />)
    expect(await screen.findByText('Matrix')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Bilgi' }))
    expect(screen.getByText('Arama bilgisi')).toBeInTheDocument()
    await user.clear(screen.getByRole('textbox', { name: 'Arama' }))
    await user.type(screen.getByRole('textbox', { name: 'Arama' }), 'Dövüş')
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(screen.queryByText('Arama bilgisi')).not.toBeInTheDocument()
    await router.navigate(-1)
    expect(router.state.location.search).toContain('q=D%C3%B6v%C3%BC')
    await router.navigate(1)
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
  })
  it('sayfa URL ile ilerler ve boş arama istek göndermez', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([{ path: '/search', element: <SearchWorkspace /> }], {
      initialEntries: ['/search'],
    })
    render(<RouterProvider router={router} />)
    expect(requests('/3/search/movie')).toHaveLength(0)
    await user.type(screen.getByRole('textbox', { name: 'Arama' }), 'Matrix')
    await screen.findByText('Matrix')
    await user.click(screen.getByRole('button', { name: 'Sonraki sayfa' }))
    expect(router.state.location.search).toContain('page=2')
    expect(requests('/3/search/movie').some((request) => request.search.get('page') === '2')).toBe(
      true,
    )
  })
})
