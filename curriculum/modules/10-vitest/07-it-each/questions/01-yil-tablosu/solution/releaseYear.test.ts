import { describe, expect, it } from 'vitest'
import { releaseYear } from '@impl/releaseYear'

describe('releaseYear', () => {
  it.each([
    ['', ''],
    ['1999-10-15', '1999'],
    ['2024-01-01', '2024'],
  ])('%s tarihi için %s döner', (date, expected) => {
    expect(releaseYear(date)).toBe(expected)
  })
})
