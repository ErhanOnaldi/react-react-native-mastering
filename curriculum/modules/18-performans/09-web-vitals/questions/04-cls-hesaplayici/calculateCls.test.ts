import { describe, expect, it } from 'vitest'
import { calculateCls, type LayoutShiftEntry } from '@exercise/calculateCls'

describe('calculateCls', () => {
  it('boş girdi listesi verildiğinde 0 döner', () => {
    expect(calculateCls([])).toBe(0)
  })

  it('yalnızca beklenmeyen (hadRecentInput: false) kaymaları toplar', () => {
    const entries: LayoutShiftEntry[] = [
      { value: 0.04, hadRecentInput: false },
      { value: 0.03, hadRecentInput: false },
    ]
    expect(calculateCls(entries)).toBe(0.07)
  })

  it('kullanıcı etkileşimi kaynaklı (hadRecentInput: true) kaymaları toplama dahil etmez', () => {
    const entries: LayoutShiftEntry[] = [
      { value: 0.05, hadRecentInput: false },
      { value: 0.18, hadRecentInput: true },
      { value: 0.02, hadRecentInput: false },
      { value: 0.25, hadRecentInput: true },
    ]
    expect(calculateCls(entries)).toBe(0.07)
  })

  it('tüm girdiler hadRecentInput: true ise 0 döner', () => {
    const entries: LayoutShiftEntry[] = [
      { value: 0.15, hadRecentInput: true },
      { value: 0.22, hadRecentInput: true },
    ]
    expect(calculateCls(entries)).toBe(0)
  })

  it('kayan nokta (floating point) toplamını 4 ondalık basamağa yuvarlar', () => {
    const entries: LayoutShiftEntry[] = [
      { value: 0.0001, hadRecentInput: false },
      { value: 0.0002, hadRecentInput: false },
    ]
    // 0.0001 + 0.0002 JS'te 0.00030000000000000003 olabilir
    expect(calculateCls(entries)).toBe(0.0003)
  })
})
