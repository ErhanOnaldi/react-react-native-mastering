import { describe, expect, expectTypeOf, it } from 'vitest'
import { posterState } from '@exercise/posterState'
import type { PosterState } from '@exercise/posterState'

describe('posterState', () => {
  it('null posteri eksik sayar', () => { expect(posterState(null)).toBe('missing') })
  it('boş yolu eksik sayar', () => { expect(posterState('')).toBe('missing') })
  it('dolu yolu hazır sayar', () => { expect(posterState('/x.jpg')).toBe('ready') })
  it('yalnızca iki durum döndürür', () => { expectTypeOf<PosterState>().toEqualTypeOf<'missing' | 'ready'>() })
})
