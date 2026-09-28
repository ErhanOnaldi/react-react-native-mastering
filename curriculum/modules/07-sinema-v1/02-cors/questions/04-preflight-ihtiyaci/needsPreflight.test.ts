import { describe, expect, it } from 'vitest'
import { needsPreflight } from '@exercise/needsPreflight'

describe('needsPreflight', () => {
  it('başlıksız GET, HEAD ve POST isteklerinde false döner', () => {
    expect(needsPreflight({ method: 'GET' })).toBe(false)
    expect(needsPreflight({ method: 'HEAD' })).toBe(false)
    expect(needsPreflight({ method: 'POST' })).toBe(false)
    expect(needsPreflight({})).toBe(false)
    expect(needsPreflight()).toBe(false)
  })

  it('yalnızca güvenli başlıklar (Accept, Accept-Language, Content-Language) içeren GET isteklerinde false döner', () => {
    expect(
      needsPreflight({
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'tr-TR,tr;q=0.9',
          'Content-Language': 'tr',
        },
      }),
    ).toBe(false)
  })

  it('izin verilen Content-Type türlerinde (ve parametrelerinde) false döner', () => {
    expect(
      needsPreflight({
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
      }),
    ).toBe(false)

    expect(
      needsPreflight({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      }),
    ).toBe(false)

    expect(
      needsPreflight({
        method: 'POST',
        headers: { 'CONTENT-TYPE': 'multipart/form-data; boundary=something' },
      }),
    ).toBe(false)
  })

  it('PUT, DELETE ve PATCH gibi basit olmayan yöntemlerde true döner', () => {
    expect(needsPreflight({ method: 'PUT' })).toBe(true)
    expect(needsPreflight({ method: 'DELETE' })).toBe(true)
    expect(needsPreflight({ method: 'PATCH' })).toBe(true)
  })

  it('Authorization başlığı gönderildiğinde true döner', () => {
    expect(
      needsPreflight({
        method: 'GET',
        headers: { Authorization: 'Bearer test-token' },
      }),
    ).toBe(true)

    expect(
      needsPreflight({
        method: 'GET',
        headers: { authorization: 'Bearer test-token' },
      }),
    ).toBe(true)
  })

  it('application/json içerik türü gönderildiğinde true döner', () => {
    expect(
      needsPreflight({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    ).toBe(true)

    expect(
      needsPreflight({
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }),
    ).toBe(true)
  })

  it('özel veya güvenli listede olmayan başlıklar gönderildiğinde true döner', () => {
    expect(
      needsPreflight({
        method: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      }),
    ).toBe(true)

    expect(
      needsPreflight({
        method: 'GET',
        headers: { 'api-key': 'secret-123' },
      }),
    ).toBe(true)
  })
})
