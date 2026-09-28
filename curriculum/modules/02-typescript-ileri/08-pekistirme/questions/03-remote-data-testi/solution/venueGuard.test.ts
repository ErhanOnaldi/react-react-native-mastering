import { describe, expect, it } from 'vitest'
import { isVenue } from '@impl/venueGuard'

describe('mekan verisini doğrulama', () => {
  it('geçerli mekan kaydını kabul eder', () => {
    expect(isVenue({ id: 12, name: 'Sahil', address: null })).toBe(true)
    expect(isVenue({ id: 12, name: 'Sahil', address: 'İskele' })).toBe(true)
  })

  it('ek alan içeren geçerli kaydı kabul eder', () => {
    expect(isVenue({ id: 12, name: 'Sahil', address: null, active: true })).toBe(true)
  })

  it('null, dizi ve primitive değerleri reddeder', () => {
    expect(isVenue(null)).toBe(false)
    expect(isVenue([])).toBe(false)
    expect(isVenue('Sahil')).toBe(false)
    expect(isVenue(12)).toBe(false)
  })

  it('eksik alanları reddeder', () => {
    expect(isVenue({ id: 12, name: 'Sahil' })).toBe(false)
    expect(isVenue({ id: 12, address: null })).toBe(false)
  })

  it('id, name ve address alanlarının yanlış türlerini reddeder', () => {
    expect(isVenue({ id: '12', name: 'Sahil', address: null })).toBe(false)
    expect(isVenue({ id: 12, name: 0, address: null })).toBe(false)
    expect(isVenue({ id: 12, name: 'Sahil', address: 7 })).toBe(false)
  })
})
