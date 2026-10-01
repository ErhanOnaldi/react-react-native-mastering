import { describe, expect, it } from 'vitest'
import { cn } from '@exercise/cn'
describe('cn', () => {
  it('son padding override’ını tutar', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
  it('koşullu nesnelerden yalnız doğru class’ı alır', () => {
    expect(cn('rounded', { 'bg-sky-700': true, hidden: false })).toBe('rounded bg-sky-700')
  })
  it('birlikte anlamlı class’ları korur', () => {
    expect(cn('rounded', 'font-bold')).toBe('rounded font-bold')
  })
  it('boş değerleri çıktıya sızdırmaz', () => {
    expect(cn('px-2', false, null, undefined)).toBe('px-2')
  })
})
