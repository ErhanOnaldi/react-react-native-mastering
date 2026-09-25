import { describe, expect, it } from 'vitest'
import { pageSlice } from '@impl/pageSlice'

const ids = Array.from({ length: 41 }, (_, index) => index + 1)
describe('pageSlice', () => {
  it.each([
    [2, Array.from({ length: 20 }, (_, index) => index + 21)],
    [3, [41]],
  ])('%i. sayfada doğru film id’lerini döner', (page, expected) => {
    expect(pageSlice(ids, page, 20)).toEqual(expected)
  })
})
