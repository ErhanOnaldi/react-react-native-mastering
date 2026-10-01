import { describe, expect, it } from 'vitest'
import { RATING_BADGES, badgeFor } from '@exercise/task'

describe('puan rozetleri', () => {
  it('yüksek puanlı filme "Çok iyi" rozeti verir', () => {
    expect(badgeFor(8.4)).toEqual({ label: 'Çok iyi', color: 'green' })
    expect(badgeFor(7.5)).toEqual({ label: 'Çok iyi', color: 'green' })
  })

  it('orta ve düşük puanlara doğru rozeti verir', () => {
    expect(badgeFor(6.1)).toEqual({ label: 'İdare eder', color: 'amber' })
    expect(badgeFor(5)).toEqual({ label: 'İdare eder', color: 'amber' })
    expect(badgeFor(3.2)).toEqual({ label: 'Zayıf', color: 'red' })
  })

  it('tabloda yalnızca üç seviye bulunur; yanlış yazılmış seviye tip hatası verir', () => {
    const readTypo = () =>
      // @ts-expect-error — 'hight' diye bir seviye yok
      RATING_BADGES.hight
    expect(Object.keys(RATING_BADGES).sort()).toEqual(['high', 'low', 'mid'])
    expect(typeof readTypo).toBe('function')
  })

  it('tablodaki rozetler sonradan değiştirilemez', () => {
    const overwrite = () => {
      // @ts-expect-error — tablo salt okunur
      RATING_BADGES.low = { label: 'Kötü', color: 'black' }
    }
    expect(typeof overwrite).toBe('function')
  })
})
