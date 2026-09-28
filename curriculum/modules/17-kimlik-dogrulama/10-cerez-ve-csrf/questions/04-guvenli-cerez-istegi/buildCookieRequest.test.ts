import { describe, expect, it } from 'vitest'
import { buildCookieRequest } from '@exercise/buildCookieRequest'

describe('buildCookieRequest', () => {
  it('varsayılan ayarlarda GET yöntemi ve credentials include döndürür', () => {
    const res = buildCookieRequest()
    expect(res.method).toBe('GET')
    expect(res.credentials).toBe('include')
    expect(res.headers).toEqual({})
  })

  it('küçük harfle verilen HTTP yöntemini büyük harfe dönüştürür', () => {
    const res = buildCookieRequest({ method: 'post' })
    expect(res.method).toBe('POST')
    expect(res.credentials).toBe('include')
  })

  it('POST ve durum değiştiren isteklerde csrfToken varsa X-CSRF-TOKEN başlığı ekler', () => {
    const postRes = buildCookieRequest({ method: 'POST', csrfToken: 'token-abc' })
    expect(postRes.headers).toMatchObject({ 'X-CSRF-TOKEN': 'token-abc' })

    const putRes = buildCookieRequest({ method: 'PUT', csrfToken: 'token-put' })
    expect(putRes.headers).toMatchObject({ 'X-CSRF-TOKEN': 'token-put' })

    const delRes = buildCookieRequest({ method: 'DELETE', csrfToken: 'token-del' })
    expect(delRes.headers).toMatchObject({ 'X-CSRF-TOKEN': 'token-del' })
  })

  it('GET isteklerinde csrfToken verilse dahi X-CSRF-TOKEN başlığı eklemez', () => {
    const res = buildCookieRequest({ method: 'GET', csrfToken: 'token-xyz' })
    expect(res.headers).not.toHaveProperty('X-CSRF-TOKEN')
  })

  it('gövde mevcutsa ve Content-Type tanımlı değilse application/json ekler', () => {
    const res = buildCookieRequest({ method: 'POST', body: '{"rating":5}' })
    expect(res.headers).toMatchObject({ 'Content-Type': 'application/json' })
    expect(res.body).toBe('{"rating":5}')
  })

  it('gövde ile birlikte verilen özel Content-Type ve diğer başlıkları korur', () => {
    const res = buildCookieRequest({
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'X-Custom': 'val' },
      body: 'düz metin',
    })
    expect(res.headers).toMatchObject({
      'Content-Type': 'text/plain',
      'X-Custom': 'val',
    })
  })
})
