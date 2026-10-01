import { describe, expect, it } from 'vitest'
import { reviewSchema } from '@exercise/review'

describe('spoiler kuralı', () => {
  it('spoiler olmayan taslağa izin verir', () => {
    expect(reviewSchema.safeParse({ body: '', hasSpoiler: false }).success).toBe(true)
  })
  it('kısa spoiler metnini reddeder ve hatayı body alanına bağlar', () => {
    const result = reviewSchema.safeParse({ body: '  kısa  ', hasSpoiler: true })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['body'])
      expect(result.error.issues[0].message).toBe('Spoiler açıklaması çok kısa')
    }
  })
  it('yeterli spoiler açıklamasını kabul eder', () => {
    expect(
      reviewSchema.safeParse({ body: 'Son sahnede gerçek ortaya çıkıyor.', hasSpoiler: true })
        .success,
    ).toBe(true)
  })
})
