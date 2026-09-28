import { describe, expect, it } from 'vitest'
import { calculateBookingTotal } from '@exercise/ticketPricing'

describe('calculateBookingTotal', () => {
  it('0 veya negatif bilet sayısında 0 döner', () => {
    expect(calculateBookingTotal(0, 100, 20)).toBe(0)
    expect(calculateBookingTotal(-2, 100, 20)).toBe(0)
  })

  it('bilet fiyatı 0 veya negatif olduğunda 0 döner', () => {
    expect(calculateBookingTotal(2, 0, 10)).toBe(0)
    expect(calculateBookingTotal(2, -50, 10)).toBe(0)
  })

  it('indirimsiz bilet toplamını doğru hesaplar (2 bilet × 100 ₺ = 200 ₺)', () => {
    expect(calculateBookingTotal(2, 100, 0)).toBe(200)
    expect(calculateBookingTotal(3, 150)).toBe(450)
  })

  it('tüm biletler üzerinden indirim tutarını doğru düşer (2 bilet × 100 ₺, %20 indirim → 160 ₺)', () => {
    // Kırık kod sadece tek biletin indirimini düşüp 180 döner
    expect(calculateBookingTotal(2, 100, 20)).toBe(160)
    expect(calculateBookingTotal(4, 100, 25)).toBe(300)
  })

  it('%100 indirimde tutarı 0 olarak hesaplar', () => {
    expect(calculateBookingTotal(3, 120, 100)).toBe(0)
  })
})
