import { QueryClient } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createRoutes } from '@project/src/app/routes'
import { renderApp } from './render-app'

describe('Uygulama iskeleti', () => {
  it('createRoutes(queryClient) bir route dizisi döner', () => {
    const routes = createRoutes(new QueryClient())
    expect(Array.isArray(routes)).toBe(true)
    expect(routes.length).toBeGreaterThan(0)
  })

  it('ana sayfada h1 "Kitaplık" başlığı var', async () => {
    renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Kitaplık' })).toBeInTheDocument()
  })

  it('bilinmeyen adreste "Sayfa bulunamadı" gösterir', async () => {
    renderApp('/boyle-bir-sayfa-yok')
    expect(await screen.findByText('Sayfa bulunamadı')).toBeInTheDocument()
  })
})
