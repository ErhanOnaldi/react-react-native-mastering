import { describe, expect, it } from 'vitest'
import { readConfig } from '@exercise/config'

describe('Zod env yapılandırması', () => {
  it('token ve başlığı trimleyip sayfayı sayıya çevirir', () => {
    expect(
      readConfig({
        VITE_TMDB_TOKEN: '  abc ',
        VITE_APP_TITLE: '  Film Evi  ',
        VITE_PAGE_SIZE: '12',
      }),
    ).toEqual({ tmdbToken: 'abc', appTitle: 'Film Evi', pageSize: 12 })
  })
  it('eksik ve boş tokenı açık adla reddeder', () => {
    expect(() => readConfig({})).toThrow(/VITE_TMDB_TOKEN/)
    expect(() => readConfig({ VITE_TMDB_TOKEN: '   ' })).toThrow(/VITE_TMDB_TOKEN/)
  })
  it('boş başlık ve hatalı sayfada varsayılanları kullanır', () => {
    for (const value of ['0', '2.5', 'abc', ''])
      expect(
        readConfig({ VITE_TMDB_TOKEN: 'abc', VITE_APP_TITLE: '  ', VITE_PAGE_SIZE: value }),
      ).toEqual({ tmdbToken: 'abc', appTitle: 'Sinema', pageSize: 20 })
  })
})
