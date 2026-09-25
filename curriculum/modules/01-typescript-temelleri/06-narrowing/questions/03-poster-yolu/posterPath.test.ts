import { describe, expect, it } from 'vitest'
import { posterPath } from '@exercise/posterPath'

describe('posterPath', () => {
  it('null posterde null döner ve çökmez', () => { expect(posterPath(null)).toBeNull() })
  it('boş yolu null kabul eder', () => { expect(posterPath('')).toBeNull() })
  it('eğik çizgisi olan yolu korur', () => { expect(posterPath('/x.jpg')).toBe('/x.jpg') })
  it('eksik eğik çizgiyi ekler', () => { expect(posterPath('x.jpg')).toBe('/x.jpg') })
})
