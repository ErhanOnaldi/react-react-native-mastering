import { describe, expect, it } from 'vitest'
import { shuffle } from '@/lib/shuffle'

describe('shuffle', () => {
  it('aynı öğeleri döndürür, girdiyi değiştirmez', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect([...result].sort()).toEqual(input)
    expect(input).toEqual([1, 2, 3, 4, 5])
  })

  it('ilk öğe her konuma düşebilir', () => {
    const seen = new Set<number>()
    for (let i = 0; i < 400; i++) seen.add(shuffle([0, 1, 2, 3]).indexOf(0))
    expect([...seen].sort()).toEqual([0, 1, 2, 3])
  })
})
