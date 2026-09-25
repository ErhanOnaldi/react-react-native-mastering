import { expect, expectTypeOf, it } from 'vitest'
import { isSuccess, message } from '@exercise/task'
import type { RemoteData } from '@exercise/task'
it('başarı durumunda veri tipini taşır', () => {
  expectTypeOf<Extract<RemoteData<{ title: string }>, { status: 'success' }>>().toEqualTypeOf<{ status: 'success'; data: { title: string } }>()
  expect(isSuccess({ status: 'success', data: 550 })).toBe(true)
  expect(isSuccess({ status: 'loading' })).toBe(false)
})
it('dört durum için doğru mesajı üretir', () => {
  expect(message({ status: 'idle' })).toBe('Hazır')
  expect(message({ status: 'loading' })).toBe('Yükleniyor')
  expect(message({ status: 'success', data: 550 })).toBe('Tamam')
  expect(message({ status: 'error', error: '401' })).toBe('401')
})
