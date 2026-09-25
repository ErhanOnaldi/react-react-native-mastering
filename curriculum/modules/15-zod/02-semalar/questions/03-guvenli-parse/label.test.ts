import { describe, expect, it } from 'vitest'
import { movieLabel } from '@exercise/label'

describe('film kartı başlığı', () => {
  it('geçerli TMDB başlığını gösterir', () => {
    expect(movieLabel({ title: 'Matrix' })).toBe('Matrix')
  })
  it('null başlıkta kontrollü uyarı gösterir', () => {
    expect(movieLabel({ title: null })).toBe('Film verisi geçersiz')
  })
  it('boş başlıkta kontrollü uyarı gösterir', () => {
    expect(movieLabel({ title: '' })).toBe('Film verisi geçersiz')
  })
})
