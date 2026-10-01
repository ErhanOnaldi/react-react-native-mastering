import { describe, expect, it } from 'vitest'
import { filterClass } from '@exercise/filterClass'
describe('filterClass', () => {
  it('aktif filtreye seçili görünüm verir', () => {
    expect(filterClass(true, false).split(' ')).toEqual(
      expect.arrayContaining(['rounded-lg', 'bg-sky-700', 'text-white']),
    )
  })
  it('pasif filtreye açık görünüm verir', () => {
    expect(filterClass(false, false).split(' ')).toEqual(
      expect.arrayContaining(['bg-slate-100', 'text-slate-900']),
    )
  })
  it('compact seçildiğinde küçük iç boşluk kullanır', () => {
    expect(filterClass(true, true).split(' ')).toEqual(expect.arrayContaining(['px-2', 'py-1']))
    expect(filterClass(true, true)).not.toContain('px-4')
  })
  it('normal boyutta geniş iç boşluk kullanır', () => {
    expect(filterClass(false, false).split(' ')).toEqual(expect.arrayContaining(['px-4', 'py-2']))
  })
})
