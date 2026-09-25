import { describe, expect, it } from 'vitest'
import { safeTitle } from '@exercise/safeTitle'

describe('safeTitle', () => {
  it('film nesnesindeki başlığı okur', () => {
    expect(safeTitle({ title: 'Dövüş Kulübü' })).toBe('Dövüş Kulübü')
  })
  it('null ve sayı değerlerinde varsayılan döner', () => {
    expect(safeTitle(null)).toBe('Başlık yok')
    expect(safeTitle(5)).toBe('Başlık yok')
  })
  it('başlık sayıysa metin diye kabul etmez', () => {
    expect(safeTitle({ title: 550 })).toBe('Başlık yok')
  })
})
