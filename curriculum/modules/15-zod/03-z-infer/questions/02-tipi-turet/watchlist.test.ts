import { describe, expect, it, expectTypeOf } from 'vitest'
import { createWatchlist } from '@exercise/watchlist'
import type { WatchlistValues } from '@exercise/watchlist'

describe('izleme listesi tipi', () => {
  it('şemadan çıkan tip ad ve görünürlük taşır', () => {
    expectTypeOf<WatchlistValues>().toEqualTypeOf<{ name: string; isPublic: boolean }>()
  })
  it('adı kırparak döndürür', () => {
    expect(createWatchlist({ name: '  Klasikler  ', isPublic: true }).name).toBe('Klasikler')
  })
  it('boş adı reddeder', () => {
    expect(() => createWatchlist({ name: '  ', isPublic: false })).toThrow()
  })
  it('boolean yerine string görünürlüğü reddeder', () => {
    expect(() => createWatchlist({ name: 'Klasikler', isPublic: 'false' })).toThrow()
  })
})
