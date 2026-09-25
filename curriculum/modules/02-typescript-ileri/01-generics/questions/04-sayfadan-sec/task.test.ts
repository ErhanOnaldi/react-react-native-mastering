import { expect, expectTypeOf, it } from 'vitest'
import { findOnPage } from '@exercise/task'
it('sayfalı cevapta filmi bulur ve diğer alanları korur', () => {
  const found = findOnPage({ page: 2, results: [{ id: 550, title: 'Dövüş Kulübü', poster_path: null }], total_pages: 4, total_results: 61 }, 550)
  expect(found?.title).toBe('Dövüş Kulübü')
  expectTypeOf(found).toEqualTypeOf<{ id: number; title: string; poster_path: null } | undefined>()
})
it('boş veya eşleşmeyen sayfada undefined döner', () => {
  expect(findOnPage({ page: 1, results: [{ id: 155 }], total_pages: 1, total_results: 1 }, 550)).toBeUndefined()
})
