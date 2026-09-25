import { describe, expect, it } from 'vitest'
import {
  watchlistSchema,
  newWatchlistSchema,
  publicWatchlistSchema,
  watchlistTitleSchema,
} from '@exercise/schemas'

describe('şema kompozisyonu', () => {
  const full = { id: '1', createdAt: '2026-09-25', name: 'Klasikler', isPublic: true }
  it('yeni listeyi sistem alanları olmadan doğrular', () => {
    expect(newWatchlistSchema.parse({ name: 'Klasikler', isPublic: true })).toEqual({
      name: 'Klasikler',
      isPublic: true,
    })
    expect(watchlistSchema.safeParse({ name: 'Klasikler', isPublic: true }).success).toBe(false)
  })
  it('boş ad kuralını türetilmiş şemada korur', () => {
    expect(newWatchlistSchema.safeParse({ name: '', isPublic: false }).success).toBe(false)
  })
  it('paylaşım URL’sini doğrulayıp tam kaydı korur', () => {
    expect(
      publicWatchlistSchema.safeParse({ ...full, shareUrl: 'https://example.com/list/1' }).success,
    ).toBe(true)
    expect(publicWatchlistSchema.safeParse({ ...full, shareUrl: 'bozuk' }).success).toBe(false)
  })
  it('başlık görünümünde yalnızca adı döndürür', () => {
    expect(watchlistTitleSchema.parse(full)).toEqual({ name: 'Klasikler' })
  })
})
