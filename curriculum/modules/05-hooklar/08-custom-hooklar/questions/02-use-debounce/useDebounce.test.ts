import { renderHook, act } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { useDebounce } from '@exercise/useDebounce'
afterEach(() => vi.useRealTimers())
describe('useDebounce', () => {
  it('ilk değeri hemen döndürür', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useDebounce('Dövüş', 300))
    expect(result.current).toBe('Dövüş')
  })
  it('son değişimi gecikme sonunda döndürür', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'M' },
    })
    rerender({ value: 'Ma' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'Mat' })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('M')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('Mat')
  })
})
