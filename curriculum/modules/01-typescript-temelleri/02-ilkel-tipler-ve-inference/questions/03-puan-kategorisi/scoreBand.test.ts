import { describe, expect, expectTypeOf, it } from 'vitest'
import { scoreBand } from '@exercise/scoreBand'

describe('scoreBand', () => {
  it('oylanmamış filmi ayrı gösterir', () => { expect(scoreBand(0)).toBe('oy yok') })
  it('8 ve üzerini yüksek sayar', () => { expect(scoreBand(8.437)).toBe('yüksek') })
  it('daha düşük puanı normal sayar', () => { expect(scoreBand(7.9)).toBe('normal') })
  it('sayı alıp metin döndürür', () => { expectTypeOf(scoreBand).toEqualTypeOf<(vote: number) => string>() })
})
