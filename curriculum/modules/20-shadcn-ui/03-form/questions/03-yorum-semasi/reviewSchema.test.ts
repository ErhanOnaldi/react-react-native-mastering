import { describe, expect, it } from 'vitest'
import { reviewSchema } from '@exercise/reviewSchema'

function messageFor(input: unknown, field: 'body' | 'rating') {
  const result = reviewSchema.safeParse(input)
  if (result.success) return undefined
  return result.error.issues.find((issue) => issue.path[0] === field)?.message
}

describe('reviewSchema', () => {
  it('geçerli yorumu temizleyip puanla birlikte döndürür', () => {
    expect(reviewSchema.parse({ body: '  Harika film  ', rating: 4 })).toEqual({
      body: 'Harika film',
      rating: 4,
    })
  })

  it('yalnız boşluk içeren yorumda “Yorum gerekli” der', () => {
    expect(messageFor({ body: '   ', rating: 4 }, 'body')).toBe('Yorum gerekli')
  })

  it('500 karakteri aşan yorumu anlaşılır mesajla reddeder', () => {
    expect(messageFor({ body: 'a'.repeat(501), rating: 4 }, 'body')).toBe(
      'Yorum en fazla 500 karakter olabilir',
    )
  })

  it('puan seçilmemişse ya da sayı değilse “Puan seç” der', () => {
    expect(messageFor({ body: 'Harika' }, 'rating')).toBe('Puan seç')
    expect(messageFor({ body: 'Harika', rating: Number.NaN }, 'rating')).toBe('Puan seç')
  })

  it('kesirli ve aralık dışı puanlara ayrı mesaj verir', () => {
    expect(messageFor({ body: 'Harika', rating: 3.5 }, 'rating')).toBe('Puan tam sayı olmalı')
    expect(messageFor({ body: 'Harika', rating: 6 }, 'rating')).toBe('Puan 1 ile 5 arasında olmalı')
    expect(messageFor({ body: 'Harika', rating: 0 }, 'rating')).toBe('Puan 1 ile 5 arasında olmalı')
  })
})
