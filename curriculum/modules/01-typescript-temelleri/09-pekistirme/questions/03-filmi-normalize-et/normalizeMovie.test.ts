import { describe, expect, expectTypeOf, it } from 'vitest'
import { normalizeMovie } from '@exercise/normalizeMovie'
import type { DisplayMovie } from '@exercise/normalizeMovie'

describe('normalizeMovie', () => {
  it('dolu tarih ve posteri görünüm alanlarına taşır', () => { expect(normalizeMovie({ id: 550, title: 'Dövüş Kulübü', release_date: '1999-10-15', poster_path: '/x.jpg' })).toEqual({ id: 550, title: 'Dövüş Kulübü', year: '1999', poster: '/x.jpg' }) })
  it('boş tarih ve null posteri güvenle işler', () => { expect(normalizeMovie({ id: 1, title: 'Yeni film', release_date: '', poster_path: null })).toEqual({ id: 1, title: 'Yeni film', year: 'Tarih yok', poster: null }) })
  it('boş poster yolunu null yapar', () => { expect(normalizeMovie({ id: 2, title: 'Film', release_date: '2026-01-01', poster_path: '' }).poster).toBeNull() })
  it('görünümde poster olasılığını korur', () => { expectTypeOf<DisplayMovie['poster']>().toEqualTypeOf<string | null>() })
})
