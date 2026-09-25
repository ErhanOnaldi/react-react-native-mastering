import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppHeader } from '@exercise/AppHeader'

describe('AppHeader', () => {
  it('başlığı h1 olarak gösterir', () => {
    render(<AppHeader title="Sinema" tagline="Bugün ne izlesek?" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Sinema' })).toBeInTheDocument()
  })

  it('alt yazıyı gösterir', () => {
    render(<AppHeader title="Sinema" tagline="Bugün ne izlesek?" />)
    expect(screen.getByText('Bugün ne izlesek?')).toBeInTheDocument()
  })

  it('farklı props ile farklı içerik gösterir', () => {
    render(<AppHeader title="Kitaplık" tagline="Ne okusak?" />)
    expect(screen.getByRole('heading', { name: 'Kitaplık' })).toBeInTheDocument()
    expect(screen.getByText('Ne okusak?')).toBeInTheDocument()
  })

  it('içeriği bir <header> içinde gösterir', () => {
    render(<AppHeader title="Sinema" tagline="Bugün ne izlesek?" />)
    expect(screen.getByRole('banner')).toContainElement(screen.getByRole('heading'))
  })
})
