import { describe, expect, expectTypeOf, it } from 'vitest'
import { viewLabel } from '@exercise/viewLabel'
import type { ViewMode } from '@exercise/viewLabel'

describe('viewLabel', () => {
  it('grid görünümünü Kartlar diye adlandırır', () => {
    expect(viewLabel('grid')).toBe('Kartlar')
  })
  it('list görünümünü Liste diye adlandırır', () => {
    expect(viewLabel('list')).toBe('Liste')
  })
  it('modu iki literal ile sınırlar', () => {
    expectTypeOf<ViewMode>().toEqualTypeOf<'grid' | 'list'>()
  })
})
