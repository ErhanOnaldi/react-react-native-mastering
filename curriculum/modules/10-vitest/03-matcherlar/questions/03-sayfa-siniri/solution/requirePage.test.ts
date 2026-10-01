import { describe, expect, it } from 'vitest'
import { requirePage } from '@impl/requirePage'

describe('requirePage', () => {
  it('geçerli ilk ve son sayfayı kabul eder', () => {
    expect(requirePage(1)).toBe(1)
    expect(requirePage(500)).toBe(500)
  })

  it('geçersiz sayfa için RangeError üretir', () => {
    for (const page of [0, -1, 2.5, 501, Number.NaN]) {
      expect(() => requirePage(page)).toThrow(new RangeError('Sayfa 1 ile 500 arasında olmalı'))
    }
  })
})
