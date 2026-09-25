import { describe, expect, expectTypeOf, it } from 'vitest'
import { pageRange } from '@exercise/pageRange'
import type { PageRange } from '@exercise/pageRange'

describe('pageRange', () => {
  it('ilk sayfada alt sınırı 1 tutar', () => {
    expect(pageRange(1, 5)).toEqual([1, 2])
  })
  it('son sayfada üst sınırı toplamda tutar', () => {
    expect(pageRange(5, 5)).toEqual([4, 5])
  })
  it('ortadaki sayfada iki komşuyu verir', () => {
    expect(pageRange(3, 5)).toEqual([2, 4])
  })
  it('iki konumlu sayı tuple’ı döndürür', () => {
    expectTypeOf(pageRange).returns.toEqualTypeOf<PageRange>()
  })
})
