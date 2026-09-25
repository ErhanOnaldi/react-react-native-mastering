import { describe, expect, it } from 'vitest'
import { yearLabel } from '@exercise/yearLabel'

describe('yearLabel', () => {
  it('ISO tarihinden yılı alır', () => {
    expect(yearLabel('2026-07-15')).toBe('2026')
  })
  it('boş tarih için kullanıcıya açıklama verir', () => {
    expect(yearLabel('')).toBe('Tarih yok')
  })
})
