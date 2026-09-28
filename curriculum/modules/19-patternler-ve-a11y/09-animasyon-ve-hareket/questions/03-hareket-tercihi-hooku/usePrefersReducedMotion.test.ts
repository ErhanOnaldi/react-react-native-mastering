import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePrefersReducedMotion } from '@exercise/usePrefersReducedMotion'

function installMediaQuery(initial: boolean) {
  let listener: ((event: MediaQueryListEvent) => void) | undefined
  const mediaQuery = {
    matches: initial,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
      listener = callback
    },
    removeEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
      if (listener === callback) listener = undefined
    },
    dispatch(next: boolean) {
      this.matches = next
      listener?.({ matches: next } as MediaQueryListEvent)
    },
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQuery),
  )
  return mediaQuery
}

afterEach(() => vi.unstubAllGlobals())

describe('azaltılmış hareket tercihi', () => {
  it('ilk render’da sistem tercihini döndürür', () => {
    installMediaQuery(true)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it('sistem tercihi değişince güncel değeri döndürür', () => {
    const mediaQuery = installMediaQuery(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    act(() => mediaQuery.dispatch(true))
    expect(result.current).toBe(true)
  })

  it('bileşen kaldırılınca değişim dinleyicisini temizler', () => {
    const mediaQuery = installMediaQuery(false)
    const { unmount } = renderHook(() => usePrefersReducedMotion())
    unmount()
    act(() => mediaQuery.dispatch(true))
  })
})
