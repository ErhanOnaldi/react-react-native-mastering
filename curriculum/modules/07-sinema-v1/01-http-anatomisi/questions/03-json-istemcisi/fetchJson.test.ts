import { describe, expect, it } from 'vitest'
import { HttpResponse, http, server } from '@test-utils'
import { fetchJson, HttpError } from '@exercise/fetchJson'

const base = 'https://api.example.test/library'

describe('fetchJson', () => {
  it('başarılı JSON cevabını döndürür ve istek seçeneklerini iletir', async () => {
    let method = ''
    let language = ''
    server.use(http.post(base, ({ request }) => {
      method = request.method
      language = request.headers.get('X-Language') ?? ''
      return HttpResponse.json({ title: 'Kıyı' })
    }))
    const result = await fetchJson<{ title: string }>(base, { method: 'POST', headers: { 'X-Language': 'tr' } })
    expect(result).toEqual({ title: 'Kıyı' })
    expect(method).toBe('POST')
    expect(language).toBe('tr')
  })

  it('204 cevabında boş gövdeyi ayrıştırmadan null döndürür', async () => {
    server.use(http.delete(base, () => new HttpResponse(null, { status: 204 })))
    await expect(fetchJson(base, { method: 'DELETE' })).resolves.toBeNull()
  })

  it.each([404, 500])('%i HTTP cevabında durum kodlu hata fırlatır', async (status) => {
    server.use(http.get(base, () => new HttpResponse('bozuk gövde', { status })))
    await expect(fetchJson(base)).rejects.toMatchObject({ name: 'HttpError', status })
  })

  it('ağ hatasını HTTP cevabı gibi göstermeden aktarır', async () => {
    server.use(http.get(base, () => HttpResponse.error()))
    await expect(fetchJson(base)).rejects.not.toBeInstanceOf(HttpError)
  })
})
