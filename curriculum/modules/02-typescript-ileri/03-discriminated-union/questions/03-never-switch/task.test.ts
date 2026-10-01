import { expect, expectTypeOf, it } from 'vitest'
import { renderState } from '@exercise/task'
it('başarı verisini callback ile farklı bağlamlarda gösterir', () => {
  expect(renderState({ status: 'success', data: { title: 'Dövüş Kulübü' } }, (m) => m.title)).toBe(
    'Dövüş Kulübü',
  )
  expectTypeOf(
    renderState({ status: 'success', data: 2 }, (n) => String(n)),
  ).toEqualTypeOf<string>()
})
it('boş, yükleme ve hata dallarını ayrı gösterir', () => {
  expect(renderState({ status: 'idle' }, String)).toBe('Henüz istek yok')
  expect(renderState({ status: 'loading' }, String)).toBe('Yükleniyor…')
  expect(renderState({ status: 'error', error: '401' }, String)).toBe('Hata: 401')
})
