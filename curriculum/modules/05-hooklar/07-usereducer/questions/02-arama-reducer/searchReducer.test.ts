import { describe, it, expect } from 'vitest'
import { searchReducer, initialState } from '@exercise/searchReducer'
describe('searchReducer', () => {
  it('yeni sorguda sayfayı sıfırlar ve eski sonuçları temizler', () => {
    const state = { ...initialState, page: 3, results: ['Eski'] }
    expect(searchReducer(state, { type: 'query', value: 'Matrix' })).toMatchObject({
      query: 'Matrix',
      page: 1,
      results: [],
      error: null,
    })
  })
  it('istek başlarken hatayı siler ve loading açar', () => {
    expect(searchReducer({ ...initialState, error: 'Hata' }, { type: 'start' })).toMatchObject({
      loading: true,
      error: null,
    })
  })
  it('başarıda sonuçları yazar ve loading kapatır', () => {
    expect(
      searchReducer({ ...initialState, loading: true }, { type: 'success', results: ['Matrix'] }),
    ).toMatchObject({ results: ['Matrix'], loading: false })
  })
  it('hatada mesajı saklar ve loading kapatır', () => {
    expect(
      searchReducer({ ...initialState, loading: true }, { type: 'error', message: 'Ağ yok' }),
    ).toMatchObject({ error: 'Ağ yok', loading: false })
  })
  it('sonraki sayfaya geçer', () => {
    expect(searchReducer(initialState, { type: 'next' }).page).toBe(2)
  })
})
