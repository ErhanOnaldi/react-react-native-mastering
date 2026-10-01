import { describe, expect, it } from 'vitest'
import { summarizeMovies } from '@impl/summarizeMovies'

describe('summarizeMovies', () => {
  it('ikinci sayfanın numarasını ve kısmi son sayfayı özetler', () => {
    const summary = summarizeMovies({
      page: 2,
      total_results: 41,
      results: [{ id: 550, title: 'Dövüş Kulübü' }],
    })
    expect(summary).toMatchObject({ page: 2 })
    expect(summary).toMatchObject({ total_pages: 3 })
  })
})
