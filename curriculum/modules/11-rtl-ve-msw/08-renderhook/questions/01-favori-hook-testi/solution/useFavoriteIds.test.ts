import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFavoriteIds } from '@impl/useFavoriteIds'
describe('useFavoriteIds', () => {
  it('film eklenir ve yeniden basılınca çıkarılır', () => {
    const { result } = renderHook(() => useFavoriteIds())
    expect(result.current.ids).toEqual([])
    act(() => result.current.toggle(550))
    expect(result.current.ids).toEqual([550])
    act(() => result.current.toggle(550))
    expect(result.current.ids).toEqual([])
  })
})
