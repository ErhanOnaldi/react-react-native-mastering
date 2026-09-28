import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { PageReader } from '@impl/PageReader'

function open(url: string) {
  const router = createMemoryRouter([{ path: '/read', element: <PageReader /> }], {
    initialEntries: [url],
  })
  render(<RouterProvider router={router} />)
  return router
}

describe('URL sayfalama', () => {
  it('ikinci sayfa adresinde doğru başlığı gösterir', () => {
    open('/read?page=2')
    expect(screen.getByText('Sayfa 2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Kayıp harita' })).toBeInTheDocument()
  })

  it('sonraki sayfa eyleminde adresi ve başlığı birlikte günceller', async () => {
    const router = open('/read?page=1')
    await userEvent.click(screen.getByRole('button', { name: 'Sonraki sayfa' }))
    expect(router.state.location.search).toBe('?page=2')
    expect(screen.getByRole('heading', { name: 'Kayıp harita' })).toBeInTheDocument()
  })

  it('bozuk sayfa değerinde ilk içeriğe güvenle döner', () => {
    open('/read?page=abc')
    expect(screen.getByText('Sayfa 1')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Kıyı kasabası' })).toBeInTheDocument()
  })
})
