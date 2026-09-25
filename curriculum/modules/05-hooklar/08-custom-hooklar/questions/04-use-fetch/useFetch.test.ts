import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { requests, TMDB_BASE, server, http, HttpResponse } from '@test-utils'
import { useFetch } from '@exercise/useFetch'
describe('useFetch', () => {
  it('null URL için idle kalır ve istek atmaz', () => {
    const { result } = renderHook(() => useFetch<{ title: string }>(null))
    expect(result.current).toEqual({ status: 'idle' })
    expect(requests()).toHaveLength(0)
  })
  it('başarılı TMDB cevabını tipli success olarak verir', async () => {
    const { result } = renderHook(() => useFetch<{ title: string }>(`${TMDB_BASE}/movie/550`))
    await waitFor(() =>
      expect(result.current).toMatchObject({ status: 'success', data: { title: 'Dövüş Kulübü' } }),
    )
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
  it('HTTP hatasını error durumuna çevirir', async () => {
    server.use(http.get(`${TMDB_BASE}/movie/550`, () => HttpResponse.json({}, { status: 500 })))
    const { result } = renderHook(() => useFetch(`${TMDB_BASE}/movie/550`))
    await waitFor(() => expect(result.current).toMatchObject({ status: 'error' }))
  })
})
