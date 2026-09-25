import { describe, expect, it } from 'vitest'
import { describeListError } from '@exercise/errors'

describe('liste hata tanısı', () => {
  it('geçerli listenin hata üretmediğini söyler', () => {
    expect(describeListError({ results: [{ title: 'Matrix' }] })).toBeNull()
  })
  it('null başlığın alan yolunu gösterir', () => {
    const msg = describeListError({ results: [{ title: null }] })
    expect(msg).toContain('results')
    expect(msg).toContain('title')
  })
  it('boş başlığı da tanılar', () => {
    expect(describeListError({ results: [{ title: '' }] })).toContain('title')
  })
})
