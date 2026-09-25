import { expect, expectTypeOf, it } from 'vitest'
import { getJson } from '@exercise/task'
import { requests, TMDB_BASE } from '@test-utils'
it('Bearer başlığıyla Türkçe 550 detayını alır', async () => {
  const promise = getJson<{ id: number; title: string }>(`${TMDB_BASE}/movie/550`, 'test-token')
  expectTypeOf(promise).toEqualTypeOf<Promise<{ id: number; title: string }>>()
  const movie = await promise
  expect(movie.title).toBe('Dövüş Kulübü')
  expect(requests('/3/movie/550')).toHaveLength(1)
})
it('404 cevabında hata fırlatır', async () => {
  await expect(getJson(`${TMDB_BASE}/movie/99999999`, 'test-token')).rejects.toThrow(
    'TMDB isteği başarısız: 404',
  )
})
