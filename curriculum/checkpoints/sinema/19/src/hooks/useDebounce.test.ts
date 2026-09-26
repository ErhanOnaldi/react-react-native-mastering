import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it('başlangıç değerini hemen, yeni değeri 500 ms sonra gösterir', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: '' },
      },
    )
    expect(result.current).toBe('')
    rerender({ value: 'film' })
    act(() => vi.advanceTimersByTime(499))
    expect(result.current).toBe('')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('film')
  })

  it('yeni aramada önceki zamanlayıcıyı temizler', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: '' },
      },
    )
    rerender({ value: 'ba' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'başlangıç' })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('')
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('başlangıç')
  })
})
