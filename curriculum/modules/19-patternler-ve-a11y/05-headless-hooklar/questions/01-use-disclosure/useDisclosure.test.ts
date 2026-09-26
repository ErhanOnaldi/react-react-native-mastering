import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDisclosure } from '@exercise/useDisclosure'

describe('useDisclosure', () => {
  it('varsayılan olarak kapalıdır; open ve close durumu değiştirir', () => {
    const { result } = renderHook(() => useDisclosure())
    expect(result.current.isOpen).toBe(false)
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })

  it('başlangıç değerini kullanır; open ve close art arda çağrılınca durumu tersine çevirmez', () => {
    const { result } = renderHook(() => useDisclosure(true))
    expect(result.current.isOpen).toBe(true)
    act(() => {
      result.current.open()
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)
    act(() => {
      result.current.close()
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('aynı olaydaki iki toggle en güncel değer üzerinden çalışır', () => {
    const { result } = renderHook(() => useDisclosure())
    act(() => {
      result.current.toggle()
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(false)
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)
  })

  it('open, close ve toggle render’lar arasında aynı fonksiyon kalır', () => {
    const { result, rerender } = renderHook(() => useDisclosure())
    const first = result.current
    act(() => result.current.open())
    rerender()
    expect(result.current.open, 'open her render’da yeni fonksiyon').toBe(first.open)
    expect(result.current.close, 'close her render’da yeni fonksiyon').toBe(first.close)
    expect(result.current.toggle, 'toggle her render’da yeni fonksiyon').toBe(first.toggle)
  })
})
