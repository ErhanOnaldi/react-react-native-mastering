import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from '@impl/useDebounce'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useDebounce', () => {
  it('son değişimi 500 ms bekler ve eski timer’ı temizler', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: '' },
    })
    expect(result.current).toBe('')
    rerender({ value: 'ba' })
    expect(result.current).toBe('')
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'başlangıç' })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('')
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('başlangıç')
  })
})
