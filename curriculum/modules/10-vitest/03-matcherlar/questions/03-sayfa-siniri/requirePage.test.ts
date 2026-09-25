import { describe, expect, it } from 'vitest'
import { requirePage } from '@exercise/requirePage'

describe('requirePage', () => {
  it('geçerli ikinci sayfayı değiştirmeden döndürür', () => {
    expect(requirePage(2)).toBe(2)
  })

  it('son geçerli sayfayı kabul eder', () => {
    expect(requirePage(500)).toBe(500)
  })

  it.each([0, -1, 2.5, 501, Number.NaN])(
    '%s geçersiz sayfa değerinde açık RangeError verir',
    (page) => {
      expect(() => requirePage(page)).toThrow(new RangeError('Sayfa 1 ile 500 arasında olmalı'))
    },
  )
})
