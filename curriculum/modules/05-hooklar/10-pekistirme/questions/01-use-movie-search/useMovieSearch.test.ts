import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { requests, server, http, HttpResponse, TMDB_BASE } from '@test-utils'
import { useMovieSearch } from '@exercise/useMovieSearch'
describe('useMovieSearch', () => {
  it('boş sorguda idle kalır ve istek atmaz', () => {
    const { result } = renderHook(() => useMovieSearch('', 0))
    expect(result.current.status).toBe('idle')
    expect(requests()).toHaveLength(0)
  })
  it('hızlı yazıda yalnızca son query için istek atar', async () => {
    const { result, rerender } = renderHook(({ q }) => useMovieSearch(q, 25), {
      initialProps: { q: '' },
    })
    rerender({ q: 'M' })
    rerender({ q: 'Ma' })
    rerender({ q: 'Matrix' })
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(requests(/search\/movie/).map((r) => r.search.get('query'))).toEqual(['Matrix'])
    expect(result.current.titles.length).toBeGreaterThan(0)
  })
  it('HTTP hatasını error durumuna taşır', async () => {
    server.use(http.get(`${TMDB_BASE}/search/movie`, () => HttpResponse.json({}, { status: 500 })))
    const { result } = renderHook(() => useMovieSearch('Matrix', 0))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toMatch(/HTTP 500/)
  })
})
