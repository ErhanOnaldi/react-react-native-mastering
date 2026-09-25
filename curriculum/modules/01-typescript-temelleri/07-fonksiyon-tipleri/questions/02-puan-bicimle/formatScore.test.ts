import { describe, expect, expectTypeOf, it } from 'vitest'
import { formatScore } from '@exercise/formatScore'

describe('formatScore', () => {
  it('0 için oylanmamış metni döner', () => { expect(formatScore(0)).toBe('Henüz oy yok') })
  it('varsayılan olarak bir ondalık kullanır', () => { expect(formatScore(7.456)).toBe('7.5') })
  it('isteğe bağlı basamak sayısını uygular', () => { expect(formatScore(7.456, 2)).toBe('7.46') })
  it('dönüş tipi metindir', () => { expectTypeOf(formatScore).returns.toEqualTypeOf<string>() })
})
