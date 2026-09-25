import { describe, expect, it } from 'vitest'
import { readConfig } from '@exercise/config'

describe('readConfig', () => {
  it('geçerli değerleri okur', () => {
    expect(
      readConfig({ VITE_TMDB_TOKEN: 'abc', VITE_APP_TITLE: 'Film Evi', VITE_PAGE_SIZE: '12' }),
    ).toEqual({ tmdbToken: 'abc', appTitle: 'Film Evi', pageSize: 12 })
  })

  it('token’daki boşlukları temizler', () => {
    expect(readConfig({ VITE_TMDB_TOKEN: '  abc \n' }).tmdbToken).toBe('abc')
  })

  it('token yoksa açıklayıcı bir hata fırlatır', () => {
    expect(() => readConfig({})).toThrow(/VITE_TMDB_TOKEN/)
  })

  it('token sadece boşluksa da hata fırlatır', () => {
    expect(() => readConfig({ VITE_TMDB_TOKEN: '   ' })).toThrow(/VITE_TMDB_TOKEN/)
  })

  it('başlık yoksa ya da boşsa "Sinema" kullanır', () => {
    expect(readConfig({ VITE_TMDB_TOKEN: 'abc' }).appTitle).toBe('Sinema')
    expect(readConfig({ VITE_TMDB_TOKEN: 'abc', VITE_APP_TITLE: '  ' }).appTitle).toBe('Sinema')
  })

  it('geçersiz sayfa boyutunda 20 kullanır', () => {
    for (const value of [undefined, '', 'abc', '-5', '0', '2.5']) {
      expect(readConfig({ VITE_TMDB_TOKEN: 'abc', VITE_PAGE_SIZE: value }).pageSize).toBe(20)
    }
  })
})
