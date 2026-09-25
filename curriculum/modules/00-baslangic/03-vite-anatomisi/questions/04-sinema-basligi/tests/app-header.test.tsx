import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@project/src/App'

describe('Sinema App', () => {
  it('"Sinema" başlığını h1 olarak gösterir', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /sinema/i })).toBeInTheDocument()
  })

  it('"Bugün ne izlesek?" alt yazısını gösterir', () => {
    render(<App />)
    expect(screen.getByText('Bugün ne izlesek?')).toBeInTheDocument()
  })

  it('başlığı bir <header> içinde gösterir', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toContainElement(screen.getByRole('heading', { level: 1 }))
  })
})
