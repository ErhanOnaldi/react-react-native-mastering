import { describe, expect, it } from 'vitest'
import { movieBadge } from '@exercise/movieBadge'

describe('movieBadge', () => {
  it('genel izleyici için etiketi ve yuvarlanmış puanı gösterir', () => { expect(movieBadge(7.456, false)).toBe('Genel · 7.5') })
  it('yetişkin içerik işaretini korur', () => { expect(movieBadge(8, true)).toBe('18+ · 8.0') })
})
