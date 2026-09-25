import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, it, expect } from 'vitest'
import { useLocalStorage } from '@exercise/useLocalStorage'
beforeEach(() => localStorage.clear())
describe('useLocalStorage', () => {
  it('kayıt yoksa başlangıç değerini verir', () => {
    const { result } = renderHook(() => useLocalStorage('tema', 'açık'))
    expect(result.current[0]).toBe('açık')
  })
  it('saklı JSON değerini ilk renderda okur', () => {
    localStorage.setItem('favoriler', '[550]')
    const { result } = renderHook(() => useLocalStorage<number[]>('favoriler', []))
    expect(result.current[0]).toEqual([550])
  })
  it('değişikliği state ve localStorage içine yazar', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>('favoriler', []))
    act(() => result.current[1]([550, 27205]))
    expect(result.current[0]).toEqual([550, 27205])
    expect(localStorage.getItem('favoriler')).toBe('[550,27205]')
  })
  it('önceki değerden güvenle yeni favori ekler', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>('favoriler', []))
    act(() => result.current[1]((old) => [...old, 550]))
    expect(result.current[0]).toEqual([550])
    expect(localStorage.getItem('favoriler')).toBe('[550]')
  })
  it('bozuk JSON için başlangıç değerine döner', () => {
    localStorage.setItem('favoriler', '{')
    const { result } = renderHook(() => useLocalStorage<number[]>('favoriler', []))
    expect(result.current[0]).toEqual([])
  })
})
