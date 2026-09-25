import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

async function renderApp() {
  vi.resetModules() // config.ts modülü env'i yükleme anında okur: her testte taze yükle
  const { default: App } = await import('@project/src/App')
  render(<App />)
}

describe('Sinema başlığı', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('config.ts, appTitle’ı env’den okur', async () => {
    vi.stubEnv('VITE_APP_TITLE', 'Film Evi')
    vi.resetModules()
    const config = await import('@project/src/config')
    expect(config.appTitle).toBe('Film Evi')
  })

  it('env yoksa "Sinema" kullanır', async () => {
    vi.stubEnv('VITE_APP_TITLE', undefined)
    vi.resetModules()
    const config = await import('@project/src/config')
    expect(config.appTitle).toBe('Sinema')
  })

  it('App başlığı appTitle’dan gelir', async () => {
    vi.stubEnv('VITE_APP_TITLE', 'Film Evi')
    await renderApp()
    expect(screen.getByRole('heading', { level: 1, name: 'Film Evi' })).toBeInTheDocument()
  })

  it('alt yazı yerinde duruyor', async () => {
    await renderApp()
    expect(screen.getByText('Bugün ne izlesek?')).toBeInTheDocument()
  })
})
