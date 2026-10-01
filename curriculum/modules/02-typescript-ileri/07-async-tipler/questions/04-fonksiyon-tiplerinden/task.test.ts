import { expect, expectTypeOf, it } from 'vitest'
import { loadMovie, movieLabel } from '@exercise/task'
import type { Movie, MoviePromise, LoadedMovie } from '@exercise/task'
it('Promise tipini film tipine bağlar', () => {
  expectTypeOf<MoviePromise>().toEqualTypeOf<Promise<Movie>>()
  expectTypeOf<MoviePromise>().not.toBeAny()
  expectTypeOf<LoadedMovie>().toEqualTypeOf<Movie>()
  expectTypeOf(loadMovie).returns.toEqualTypeOf<MoviePromise>()
})
it('filmi asenkron olarak yükler', async () => {
  const movie = await loadMovie()
  expect(movie).toEqual({ id: 550, title: 'Dövüş Kulübü' })
  expect(movieLabel(movie)).toBe('Dövüş Kulübü (#550)')
})
