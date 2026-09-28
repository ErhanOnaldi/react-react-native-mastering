import { describe, expect, it } from 'vitest'
import { truncateOverview } from '@exercise/truncateOverview'

describe('truncateOverview', () => {
  it('metin sınırdan kısaysa olduğu gibi döner', () => {
    expect(truncateOverview('Kısa özet', 20)).toBe('Kısa özet')
  })

  it('metin tam sınır uzunluğundaysa olduğu gibi döner', () => {
    expect(truncateOverview('On karakter', 11)).toBe('On karakter')
  })

  it('sınırı aşan metni kesip sonuna üç nokta ekler', () => {
    expect(truncateOverview('Geleceğe Dönüş bir bilimkurgu klasiğidir', 14)).toBe('Geleceğe Dönüş...')
  })

  it('kesilen metnin sonundaki boşlukları temizler', () => {
    expect(truncateOverview('Sinema salonu doluydu', 7)).toBe('Sinema...')
  })

  it('kesilen metin zaten üç nokta ile bitiyorsa fazladan üç nokta eklemez', () => {
    expect(truncateOverview('Ve son...', 9)).toBe('Ve son...')
  })
})
