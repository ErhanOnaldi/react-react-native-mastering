import { describe, expect, it } from 'vitest'
import { makeMovie } from '@exercise/makeMovie'
describe('makeMovie', () => {
  it('poster yok ve tarih boş farklarını aynen korur', () => {
    const movie = makeMovie({ id: 603, title: 'Matrix', poster_path: null, release_date: '' })
    expect(movie).toMatchObject({ id: 603, title: 'Matrix', poster_path: null, release_date: '' })
    expect(movie.original_title).toBeTruthy()
  })
  it('her çağrıda bağımsız tür dizisi üretir', () => {
    const first = makeMovie()
    const second = makeMovie()
    expect(first.genre_ids).not.toBe(second.genre_ids)
    first.genre_ids.push(99)
    expect(second.genre_ids).not.toContain(99)
  })
})
