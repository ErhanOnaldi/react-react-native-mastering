import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { addFavorite } from '@impl/favoriteStore'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('addFavorite', () => {
  it('favori id’sini beklenen anahtara kaydeder', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    addFavorite(550)
    expect(spy).toHaveBeenCalledWith('favoriteIds', '[550]')
  })

  it('aynı filmi iki kez kaydetmez', () => {
    addFavorite(550)
    addFavorite(550)
    expect(JSON.parse(localStorage.getItem('favoriteIds') ?? '[]')).toEqual([550])
  })
})
