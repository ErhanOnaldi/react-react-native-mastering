import { describe, expect, it } from 'vitest'
import { expectTypeOf } from 'vitest'
import { t } from '@exercise/messages'
import type { Message } from '@exercise/messages'

describe('yerelleştirilmiş mesaj kataloğu', () => {
  it('Türkçe film sayısını üretir', () => {
    expect(t({ key: 'movieCount', count: 3 }, 'tr')).toBe('3 film')
  })

  it('İngilizce tekil ve çoğul film adını seçer', () => {
    expect(t({ key: 'movieCount', count: 1 }, 'en')).toBe('1 movie')
    expect(t({ key: 'movieCount', count: 3 }, 'en')).toBe('3 movies')
  })

  it('mesaj parametrelerini metne yerleştirir', () => {
    expect(t({ key: 'welcome', name: 'Ada' }, 'en')).toBe('Welcome, Ada')
    expect(t({ key: 'welcome', name: 'Ece' }, 'tr')).toBe('Merhaba, Ece')
  })

  it('mesaj türü kendi parametresini taşır', () => {
    expectTypeOf<Message>().toEqualTypeOf<
      { key: 'movieCount'; count: number } | { key: 'welcome'; name: string }
    >()
    // @ts-expect-error movieCount mesajı name değil count alır
    t({ key: 'movieCount', name: 'Ada' }, 'en')
    // @ts-expect-error katalogda trailer mesajı yok
    t({ key: 'trailer', videoId: 'abc' }, 'en')
  })
})
