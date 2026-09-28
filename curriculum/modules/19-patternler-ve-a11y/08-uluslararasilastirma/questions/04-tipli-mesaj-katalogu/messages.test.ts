import { describe, expect, it } from 'vitest'
import { expectTypeOf } from 'vitest'
import { t } from '@exercise/messages'

describe('yerelleştirilmiş mesaj kataloğu', () => {
  it('Türkçe film sayısını üretir', () => {
    expect(t('movieCount', { count: 3 }, 'tr')).toBe('3 film')
  })

  it('İngilizce tekil ve çoğul film adını seçer', () => {
    expect(t('movieCount', { count: 1 }, 'en')).toBe('1 movie')
    expect(t('movieCount', { count: 3 }, 'en')).toBe('3 movies')
  })

  it('mesaj parametrelerini metne yerleştirir', () => {
    expect(t('welcome', { name: 'Ada' }, 'en')).toBe('Welcome, Ada')
    expect(t('welcome', { name: 'Ece' }, 'tr')).toBe('Merhaba, Ece')
  })

  it('yalnızca katalogdaki mesaj anahtarlarını sunar', () => {
    expectTypeOf<Parameters<typeof t>[0]>().toEqualTypeOf<'movieCount' | 'welcome'>()
  })
})
