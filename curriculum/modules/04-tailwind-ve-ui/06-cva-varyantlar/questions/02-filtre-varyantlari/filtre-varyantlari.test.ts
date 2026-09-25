import { describe, expect, it } from 'vitest'
import { filterVariants } from '@exercise/filterVariants'
describe('filterVariants', () => {
  it('varsayılan filtrede plain ve md class’larını üretir', () => {
    expect(filterVariants().split(' ')).toEqual(
      expect.arrayContaining(['rounded-lg', 'bg-slate-100', 'px-4']),
    )
  })
  it('seçili filtreye belirgin arka plan verir', () => {
    expect(filterVariants({ tone: 'selected' })).toContain('bg-sky-700')
  })
  it('küçük seçili filtrede compound vurgu ekler', () => {
    expect(filterVariants({ tone: 'selected', size: 'sm' }).split(' ')).toEqual(
      expect.arrayContaining(['px-2', 'font-bold']),
    )
  })
  it('büyük seçili filtrede compound vurguyu eklemez', () => {
    expect(filterVariants({ tone: 'selected', size: 'md' })).not.toContain('font-bold')
  })
})
