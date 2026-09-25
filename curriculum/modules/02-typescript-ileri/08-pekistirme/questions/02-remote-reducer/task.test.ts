import { expect, expectTypeOf, it } from 'vitest'
import { transition } from '@exercise/task'
import type { RemoteData } from '@exercise/task'
it('yükleme başlayınca eski başarı verisini taşımaz', () => {
  const next = transition({ status: 'success', data: { title: 'Dövüş Kulübü' } }, { type: 'start' })
  expect(next).toEqual({ status: 'loading' })
})
it('başarı ve hata geçişlerini ayrı tutar', () => {
  const loading: RemoteData<number> = { status: 'loading' }
  expect(transition(loading, { type: 'resolve', data: 550 })).toEqual({
    status: 'success',
    data: 550,
  })
  expect(transition(loading, { type: 'reject', error: '401' })).toEqual({
    status: 'error',
    error: '401',
  })
  expectTypeOf(transition<number>(loading, { type: 'reset' })).toEqualTypeOf<RemoteData<number>>()
})
it('reset durumunu idle yapar', () => {
  expect(
    transition({ status: 'error', error: '404' } as RemoteData<number>, { type: 'reset' }),
  ).toEqual({ status: 'idle' })
})
