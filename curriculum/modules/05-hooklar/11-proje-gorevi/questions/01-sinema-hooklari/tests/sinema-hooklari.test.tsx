import { renderHook, act, waitFor } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { requests, TMDB_BASE, server, http, HttpResponse, delay } from '@test-utils'
import { useDebounce } from '@project/src/hooks/useDebounce'
import { useLocalStorage } from '@project/src/hooks/useLocalStorage'
import { useFetch } from '@project/src/hooks/useFetch'
afterEach(() => vi.useRealTimers())
describe('Sinema hook sözleşmesi', () => {
  it('useDebounce son değeri gecikmeyle verir', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 20), {
      initialProps: { value: 'M' },
    })
    rerender({ value: 'Matrix' })
    expect(result.current).toBe('M')
    act(() => vi.advanceTimersByTime(19))
    expect(result.current).toBe('M')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('Matrix')
  })
  it('useLocalStorage favorileri saklar', () => {
    localStorage.removeItem('m5-favorites')
    const { result } = renderHook(() => useLocalStorage<number[]>('m5-favorites', []))
    act(() => result.current[1]([550]))
    expect(result.current[0]).toEqual([550])
    expect(JSON.parse(localStorage.getItem('m5-favorites') ?? '[]')).toEqual([550])
    act(() => result.current[1]((old) => [...old, 27205]))
    expect(result.current[0]).toEqual([550, 27205])
  })
  it('useFetch yetkili TMDB cevabını success olarak verir', async () => {
    const { result } = renderHook(() => useFetch<{ title: string }>(`${TMDB_BASE}/movie/550`))
    await waitFor(() =>
      expect(result.current).toMatchObject({ status: 'success', data: { title: 'Dövüş Kulübü' } }),
    )
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
  it('useFetch HTTP hatasını error durumuna taşır', async () => {
    server.use(http.get(`${TMDB_BASE}/movie/550`, () => HttpResponse.json({}, { status: 500 })))
    const { result } = renderHook(() => useFetch(`${TMDB_BASE}/movie/550`))
    await waitFor(() => expect(result.current.status).toBe('error'))
  })
  it('useFetch URL değişince eski isteği iptal eder', async () => {
    let oldSignal: AbortSignal | undefined
    server.use(
      http.get(`${TMDB_BASE}/movie/:id`, async ({ request, params }) => {
        if (params.id === '550') {
          oldSignal = request.signal
          await delay(90)
        }
        return HttpResponse.json({ title: params.id === '550' ? 'Dövüş Kulübü' : 'Başlangıç' })
      }),
    )
    const view = renderHook(({ id }) => useFetch<{ title: string }>(`${TMDB_BASE}/movie/${id}`), {
      initialProps: { id: 550 },
    })
    await waitFor(() => expect(oldSignal).toBeDefined())
    view.rerender({ id: 27205 })
    expect(oldSignal?.aborted).toBe(true)
    await waitFor(() =>
      expect(view.result.current).toMatchObject({
        status: 'success',
        data: { title: 'Başlangıç' },
      }),
    )
  })
  it('useFetch null URL için istek atmaz', () => {
    const { result } = renderHook(() => useFetch(null))
    expect(result.current.status).toBe('idle')
    expect(requests()).toHaveLength(0)
  })
})
