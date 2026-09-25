import { describe, expect, expectTypeOf, it } from 'vitest'
import { isIdle, isLoading, isSuccess, isError } from '@project/src/lib/remote-data'
import type { RemoteData } from '@project/src/lib/remote-data'

describe('RemoteData', () => {
  it('başarı yalnız data, hata yalnız error taşır', () => {
    expectTypeOf<Extract<RemoteData<number>, { status: 'success' }>>().toEqualTypeOf<{
      status: 'success'
      data: number
    }>()
    expectTypeOf<Extract<RemoteData<number>, { status: 'error' }>>().toEqualTypeOf<{
      status: 'error'
      error: string
    }>()
    expectTypeOf<Extract<RemoteData<number>, { status: 'loading' }>>().toEqualTypeOf<{
      status: 'loading'
    }>()
    expectTypeOf<Extract<RemoteData<number>, { status: 'idle' }>>().toEqualTypeOf<{
      status: 'idle'
    }>()
  })
  it('dört yardımcı kendi durumunu ayırt eder', () => {
    const states: RemoteData<number>[] = [
      { status: 'idle' },
      { status: 'loading' },
      { status: 'success', data: 550 },
      { status: 'error', error: '401' },
    ]
    expect(states.map(isIdle)).toEqual([true, false, false, false])
    expect(states.map(isLoading)).toEqual([false, true, false, false])
    expect(states.map(isSuccess)).toEqual([false, false, true, false])
    expect(states.map(isError)).toEqual([false, false, false, true])
  })
  it('başarı guard’ı generic veri tipini korur', () => {
    const state: RemoteData<{ title: string }> = {
      status: 'success',
      data: { title: 'Dövüş Kulübü' },
    }
    if (isSuccess(state)) {
      expectTypeOf(state.data).toEqualTypeOf<{ title: string }>()
      expect(state.data.title).toBe('Dövüş Kulübü')
    }
  })
})
