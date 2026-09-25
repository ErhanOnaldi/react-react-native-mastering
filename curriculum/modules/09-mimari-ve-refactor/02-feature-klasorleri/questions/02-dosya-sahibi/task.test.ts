import { describe, expect, it } from 'vitest'
import { chooseFolder } from '@exercise/chooseFolder'

describe('dosya sahipliği', () => {
  it('tek kullanıcılı SearchBox dosyasını search feature’ına koyar', () => {
    expect(chooseFolder(['search'])).toBe('features/search')
  })
  it('aynı feature içindeki iki kullanımı ortak kod saymaz', () => {
    expect(chooseFolder(['movies', 'movies'])).toBe('features/movies')
  })
  it('iki feature’ın kullandığı poster yardımcısını shared yapar', () => {
    expect(chooseFolder(['movies', 'favorites'])).toBe('shared')
  })
  it('kullanılmayan dosyayı erken ortaklaştırmaz', () => {
    expect(chooseFolder([])).toBe('unassigned')
  })
})
