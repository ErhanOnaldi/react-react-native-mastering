import { describe, expect, it } from 'vitest'
import { parseMovie } from '@exercise/movie'

describe('film şeması', () => {
  it('Dövüş Kulübü için null posteri kabul eder', () => {
    expect(parseMovie({ id: 550, title: 'Dövüş Kulübü', poster_path: null }).poster_path).toBeNull()
  })
  it('null başlığı veri sınırında reddeder', () => {
    expect(() => parseMovie({ id: 550, title: null, poster_path: null })).toThrow()
  })
  it('geçersiz ve kesirli kimliği reddeder', () => {
    expect(() => parseMovie({ id: 0, title: 'Film', poster_path: null })).toThrow()
    expect(() => parseMovie({ id: 1.5, title: 'Film', poster_path: null })).toThrow()
  })
  it('boş başlığı reddeder', () => {
    expect(() => parseMovie({ id: 1, title: '', poster_path: null })).toThrow()
  })
})
