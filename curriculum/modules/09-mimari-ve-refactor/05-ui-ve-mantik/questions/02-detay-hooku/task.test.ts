import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMovieDetails } from '@exercise/useMovieDetails'

describe('useMovieDetails', () => {
  it('yükleme durumundan film detayına geçer', async () => {
    const load = vi.fn(async () => ({ id: 550, title: 'Dövüş Kulübü' }))
    const { result } = renderHook(() => useMovieDetails(550, load))
    await waitFor(() =>
      expect(result.current).toEqual({
        status: 'success',
        movie: { id: 550, title: 'Dövüş Kulübü' },
      }),
    )
    expect(load).toHaveBeenCalledWith(550, expect.any(AbortSignal))
  })
  it('id değişince önceki isteğin sinyalini iptal edip yeni filmi gösterir', async () => {
    const signals: AbortSignal[] = []
    const load = vi.fn(async (id: number, signal: AbortSignal) => {
      signals.push(signal)
      return { id, title: id === 550 ? 'Dövüş Kulübü' : 'Matrix' }
    })
    const { result, rerender } = renderHook(({ id }) => useMovieDetails(id, load), {
      initialProps: { id: 550 },
    })
    await waitFor(() => expect(result.current.status).toBe('success'))
    rerender({ id: 603 })
    await waitFor(() =>
      expect(result.current).toEqual({ status: 'success', movie: { id: 603, title: 'Matrix' } }),
    )
    expect(signals[0].aborted).toBe(true)
  })
  it('aktif isteğin hatasını mesajıyla gösterir', async () => {
    const load = vi.fn(async () => {
      throw new Error('TMDB kapalı')
    })
    const { result } = renderHook(() => useMovieDetails(550, load))
    await waitFor(() => expect(result.current).toEqual({ status: 'error', message: 'TMDB kapalı' }))
  })
})
