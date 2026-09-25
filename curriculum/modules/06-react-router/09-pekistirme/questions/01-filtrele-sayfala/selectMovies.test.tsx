import { describe, expect, it } from 'vitest'
import { selectMovies } from '@exercise/selectMovies'

const movies = [
  { id: 550, title: 'Dövüş Kulübü', genre_ids: [18] },
  { id: 155, title: 'Kara Şövalye', genre_ids: [28] },
  { id: 603, title: 'Matrix', genre_ids: [28] },
  { id: 27205, title: 'Başlangıç', genre_ids: [28] },
]
describe('URL ile statik liste', () => {
  it('arama ve tür filtresini birlikte uygular', () =>
    expect(
      selectMovies(movies, new URLSearchParams('q=mat&genre=28'), 2).map((movie) => movie.title),
    ).toEqual(['Matrix']))
  it('Türkçe başlık aramasında ilk sayfayı gösterir', () =>
    expect(
      selectMovies(movies, new URLSearchParams('q=dövüş'), 2).map((movie) => movie.id),
    ).toEqual([550]))
  it('filtreledikten sonra ikinci sayfayı keser', () =>
    expect(
      selectMovies(movies, new URLSearchParams('genre=28&page=2'), 2).map((movie) => movie.id),
    ).toEqual([27205]))
  it('geçersiz tür değerini filtre olarak kullanmaz', () =>
    expect(
      selectMovies(movies, new URLSearchParams('genre=abc'), 2).map((movie) => movie.id),
    ).toEqual([550, 155]))
  it('geçersiz sayfayı birinci sayfa sayar', () =>
    expect(
      selectMovies(movies, new URLSearchParams('page=abc'), 2).map((movie) => movie.id),
    ).toEqual([550, 155]))
})
