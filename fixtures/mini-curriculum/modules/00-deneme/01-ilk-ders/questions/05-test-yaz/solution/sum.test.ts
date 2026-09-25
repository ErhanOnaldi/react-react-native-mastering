import { describe, expect, it } from 'vitest'
import { sum } from '@impl/sum'

describe('sum', () => {
  it('iki sayıyı toplar', () => {
    expect(sum(2, 3)).toBe(5)
  })
})
