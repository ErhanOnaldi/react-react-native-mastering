import { afterEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse, server } from '@test-utils'
import { sendErrorReport } from '@exercise/sendErrorReport'

const endpoint = 'https://errors.example.test/ingest'

afterEach(() => vi.unstubAllGlobals())

describe('sendErrorReport', () => {
  it('kapanışa uygun gönderim başarılıysa ikinci istek atmaz', async () => {
    const beacon = vi.fn(() => true)
    vi.stubGlobal('navigator', { sendBeacon: beacon })
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    expect(
      await sendErrorReport(new TypeError('Bozuk veri'), endpoint, { page: '/etkinlik/42' }),
    ).toBe(true)
    const [url, blob] = beacon.mock.calls[0] as unknown as [string, Blob]
    expect(url).toBe(endpoint)
    expect(JSON.parse(await blob.text())).toEqual({
      name: 'TypeError',
      message: 'Bozuk veri',
      context: { page: '/etkinlik/42' },
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('ilk gönderim başarısızsa hatayı yedek POST ile ulaştırır', async () => {
    vi.stubGlobal('navigator', { sendBeacon: () => false })
    let received: unknown
    server.use(
      http.post(endpoint, async ({ request }) => {
        received = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )
    expect(await sendErrorReport('Beklenmeyen hata', endpoint)).toBe(true)
    expect(received).toEqual({ name: 'UnknownError', message: 'Beklenmeyen hata', context: {} })
  })

  it('başarısız HTTP yanıtını ve ağ hatasını başarısız sonuç olarak bildirir', async () => {
    vi.stubGlobal('navigator', { sendBeacon: () => false })
    server.use(http.post(endpoint, () => new HttpResponse(null, { status: 503 })))
    expect(await sendErrorReport(new Error('Kesinti'), endpoint)).toBe(false)
  })
})
