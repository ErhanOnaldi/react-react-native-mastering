import { expect, expectTypeOf, it } from 'vitest'
import { findById } from '@exercise/task'
it('filmi ID ile bulur ve bütün alanlarını korur', () => {
  const found = findById([{ id: 550, title: 'Dövüş Kulübü' }], 550)
  expect(found?.title).toBe('Dövüş Kulübü')
  expectTypeOf(found).toEqualTypeOf<{ id: number; title: string } | undefined>()
})
it('başka nesne türünü ve readonly listeyi kabul eder', () => {
  expect(findById([{ id: 18, name: 'Dram' }] as const, 18)?.name).toBe('Dram')
})
it('eşleşme yoksa undefined döndürür', () => {
  expect(findById([{ id: 550 }], 42)).toBeUndefined()
})
