// @vitest-environment jsdom
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse, server } from '@test-utils'
import { reportError } from '@project/src/shared/lib/report-error'

const project = process.env.RM_PROJECT_DIR ?? ''
const read = (path: string) => readFileSync(join(project, path), 'utf8')
const endpoint = 'https://errors.example.test/ingest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Sinema yayın hazırlığı', () => {
  it('derin bağlantılar için başarılı HTML fallback kuralı sağlar', () => {
    expect(existsSync(join(project, 'public/_redirects'))).toBe(true)
    expect(read('public/_redirects')).toMatch(/^\/\*\s+\/index\.html\s+200\s*$/m)
  })

  it('hashli assetleri uzun cacheler ve HTML belgesini yeniden doğrular', () => {
    const headers = read('public/_headers')
    expect(headers).toMatch(
      /\/assets\/\*[\s\S]*?Cache-Control:\s*public,\s*max-age=31536000,\s*immutable/,
    )
    expect(headers).toMatch(/\/index\.html[\s\S]*?Cache-Control:\s*no-cache/)
  })

  it('TMDB ile DummyJSON bağlantılarına izin veren CSP ve temel güvenlik başlıkları sağlar', () => {
    const headers = read('public/_headers')
    expect(headers).toMatch(/Content-Security-Policy:/)
    expect(headers).toMatch(/connect-src[^\n]*https:\/\/api\.themoviedb\.org/)
    expect(headers).toMatch(/connect-src[^\n]*https:\/\/dummyjson\.com/)
    expect(headers).toMatch(/X-Content-Type-Options:\s*nosniff/)
    expect(headers).toMatch(/Referrer-Policy:/)
  })

  it('production build için gizli source map üretir', () => {
    expect(read('vite.config.ts')).toMatch(/sourcemap:\s*['"]hidden['"]/)
  })

  it('adres yoksa hatayı konsola yazar', async () => {
    vi.stubEnv('VITE_ERROR_ENDPOINT', '')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Ekran açılamadı')
    await expect(reportError(error, { route: '/movie/550' })).resolves.toBeUndefined()
    expect(consoleSpy).toHaveBeenCalledWith(error, { route: '/movie/550' })
  })

  it('adres varsa hata ve bağlamı JSON olarak gönderir', async () => {
    vi.stubEnv('VITE_ERROR_ENDPOINT', endpoint)
    vi.stubGlobal('navigator', { sendBeacon: () => false })
    let received: unknown
    server.use(
      http.post(endpoint, async ({ request }) => {
        received = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )
    await expect(
      reportError(new TypeError('Film kartı bozuldu'), { route: '/movie/550' }),
    ).resolves.toBeUndefined()
    expect(received).toMatchObject({
      name: 'TypeError',
      message: 'Film kartı bozuldu',
      context: { route: '/movie/550' },
    })
  })

  it('rapor gövdesi hazırlanamazsa kullanıcı akışına hata fırlatmaz', async () => {
    vi.stubEnv('VITE_ERROR_ENDPOINT', endpoint)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const circular: Record<string, unknown> = {}
    circular.self = circular
    await expect(reportError(new Error('Bozuk veri'), circular)).resolves.toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })
})
