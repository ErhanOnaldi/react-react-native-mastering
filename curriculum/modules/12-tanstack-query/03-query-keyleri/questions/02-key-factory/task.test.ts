import { describe, expect, it } from 'vitest'
import { movieKeys } from '@exercise/movieKeys'
describe('film key factory', () => {
  it('aynı arama ve sayfa için aynı cache kimliğini üretir', () => {
    expect(movieKeys.search('Matrix', 1)).toEqual(movieKeys.search(' Matrix ', 1))
  })
  it('farklı arama ve sayfa için farklı kimlik üretir', () => {
    expect(movieKeys.search('Matrix', 1)).not.toEqual(movieKeys.search('Dövüş', 1))
    expect(movieKeys.search('Matrix', 1)).not.toEqual(movieKeys.search('Matrix', 2))
  })
  it('detay id değerini keye ekler', () => {
    expect(movieKeys.detail(550)).not.toEqual(movieKeys.detail(27205))
    expect(movieKeys.detail(550)).toEqual(['movies', 'detail', 550])
  })
})
