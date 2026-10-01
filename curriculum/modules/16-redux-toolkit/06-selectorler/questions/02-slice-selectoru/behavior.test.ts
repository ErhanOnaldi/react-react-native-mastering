import { describe, expect, it } from 'vitest'
import { selectIsDark, setTheme, uiSlice } from '@exercise/ui'
describe('tema selector’ı', () => {
  it('başlangıçta açık temayı bildirir', () => {
    expect(selectIsDark({ ui: uiSlice.reducer(undefined, { type: 'init' }) })).toBe(false)
  })
  it('tema action’ından sonra koyu temayı bildirir', () => {
    const ui = uiSlice.reducer(undefined, setTheme('dark'))
    expect(selectIsDark({ ui })).toBe(true)
  })
})
