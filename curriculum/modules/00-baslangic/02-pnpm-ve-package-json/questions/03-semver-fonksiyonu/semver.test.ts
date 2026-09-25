import { describe, expect, it } from 'vitest'
import { satisfiesCaret } from '@exercise/semver'

describe('satisfiesCaret', () => {
  it('aynı sürümü kabul eder', () => {
    expect(satisfiesCaret('19.3.0', '^19.3.0')).toBe(true)
  })

  it('daha yeni patch sürümünü kabul eder (19.3.5)', () => {
    expect(satisfiesCaret('19.3.5', '^19.3.0')).toBe(true)
  })

  it('daha yeni minor sürümünü kabul eder (19.9.0)', () => {
    expect(satisfiesCaret('19.9.0', '^19.3.0')).toBe(true)
  })

  it('yeni minor’da patch küçük olsa da kabul eder (19.4.0 ≥ 19.3.7)', () => {
    expect(satisfiesCaret('19.4.0', '^19.3.7')).toBe(true)
  })

  it('farklı MAJOR’u reddeder (20.0.0)', () => {
    expect(satisfiesCaret('20.0.0', '^19.3.0')).toBe(false)
  })

  it('alt sınırdan küçük sürümü reddeder (19.2.9)', () => {
    expect(satisfiesCaret('19.2.9', '^19.3.0')).toBe(false)
  })

  it('aynı minor’da küçük patch’i reddeder (19.3.1 < 19.3.2)', () => {
    expect(satisfiesCaret('19.3.1', '^19.3.2')).toBe(false)
  })
})
