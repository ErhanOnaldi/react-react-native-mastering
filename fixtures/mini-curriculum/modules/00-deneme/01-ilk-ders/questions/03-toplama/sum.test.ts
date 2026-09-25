import { describe, expect, it } from 'vitest'
import { sum } from '@exercise/sum'

describe('sum', () => {
  it('iki pozitif sayıyı toplar', () => {
    expect(sum(1, 2)).toBe(3)
  })

  it('sıfır ile toplamda sayıyı değiştirmez', () => {
    expect(sum(5, 0)).toBe(5)
  })
})
