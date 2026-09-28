import { describe, expect, it } from 'vitest'
import {
  initialMovieSearchState,
  movieSearchReducer,
  type MovieSearchState,
} from '@impl/movieSearchReducer'

describe('movieSearchReducer', () => {
  it('yeni yazılan sorguda idle duruma döner ve eski sonucu temizler', () => {
    const previous: MovieSearchState = {
      status: 'success',
      query: 'Dövüş',
      results: ['Dövüş Kulübü'],
      error: null,
    }

    const next = movieSearchReducer(previous, { type: 'typed', query: 'Matrix' })

    expect(next).toEqual({ status: 'idle', query: 'Matrix', results: [], error: null })
  })

  it('arama başlayınca loading durumuna geçer ve eski hatayı temizler', () => {
    const previous: MovieSearchState = {
      status: 'error',
      query: 'Matrix',
      results: [],
      error: 'HTTP 500',
    }

    const next = movieSearchReducer(previous, { type: 'started' })

    expect(next).toEqual({ status: 'loading', query: 'Matrix', results: [], error: null })
  })

  it('başarıda sonuçları yazar ve hata mesajını temizler', () => {
    const previous: MovieSearchState = {
      status: 'error',
      query: 'Matrix',
      results: [],
      error: 'HTTP 500',
    }

    const next = movieSearchReducer(previous, {
      type: 'succeeded',
      results: ['Matrix', 'Matrix Reloaded'],
    })

    expect(next).toEqual({
      status: 'success',
      query: 'Matrix',
      results: ['Matrix', 'Matrix Reloaded'],
      error: null,
    })
  })

  it('hatada sonuçları temizler ve hata mesajını saklar', () => {
    const previous: MovieSearchState = {
      status: 'success',
      query: 'Matrix',
      results: ['Matrix'],
      error: null,
    }

    const next = movieSearchReducer(previous, { type: 'failed', error: 'Ağ yok' })

    expect(next).toEqual({ status: 'error', query: 'Matrix', results: [], error: 'Ağ yok' })
  })

  it('başlangıç durumunu boş ve idle tutar', () => {
    expect(initialMovieSearchState).toEqual({
      status: 'idle',
      query: '',
      results: [],
      error: null,
    })
  })
})
