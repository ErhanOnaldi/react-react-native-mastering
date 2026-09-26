// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createSinemaConfig } from '@exercise/sinemaConfig'

const local = createSinemaConfig({ ci: false })
const ci = createSinemaConfig({ ci: true })

function server(config: ReturnType<typeof createSinemaConfig>) {
  const webServer = config.webServer
  expect(webServer, 'webServer tek bir nesne olmalı').toBeTypeOf('object')
  expect(Array.isArray(webServer), 'Tek sunucu var: dizi değil, nesne ver').toBe(false)
  return webServer as Exclude<typeof webServer, unknown[] | undefined>
}

describe('createSinemaConfig', () => {
  it('testleri e2e klasöründe arar', () => {
    expect(local.testDir).toMatch(/^(\.\/)?e2e\/?$/)
  })

  it('baseURL Sinema’nın dev sunucusu: http://localhost:5174', () => {
    expect(local.use?.baseURL).toBe('http://localhost:5174')
  })

  it('webServer testlerden önce "pnpm dev" çalıştırır', () => {
    expect(server(local).command).toMatch(/^pnpm (run )?dev\b/)
  })

  it('webServer, baseURL ile aynı adresin hazır olmasını bekler', () => {
    expect(server(local).url, 'webServer.url ile use.baseURL aynı adresi göstermeli').toBe(
      local.use?.baseURL,
    )
  })

  it('yerelde açık olan sunucuyu kullanır, CI’da her zaman yenisini başlatır', () => {
    expect(server(local).reuseExistingServer, 'ci: false → yeniden kullan').toBe(true)
    expect(server(ci).reuseExistingServer, 'ci: true → temiz sunucu').toBe(false)
  })

  it('sunucuya sahte bir VITE_TMDB_TOKEN verir (CI’da .env yok)', () => {
    const token = server(local).env?.VITE_TMDB_TOKEN
    expect(token, 'webServer.env.VITE_TMDB_TOKEN boş olmamalı').toBeTypeOf('string')
    expect(token?.trim()).not.toBe('')
  })

  it('"chromium" projesini Desktop Chrome profiliyle tanımlar', () => {
    const chromium = local.projects?.find((p) => p.name === 'chromium')
    expect(chromium, 'name: "chromium" olan bir proje yok').toBeDefined()
    expect(chromium?.use?.defaultBrowserType).toBe('chromium')
    expect(chromium?.use?.viewport).toEqual({ width: 1280, height: 720 })
  })
})
