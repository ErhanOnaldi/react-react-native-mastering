import { describe, expect, it } from 'vitest'
import { coverUrl } from './covers'
import { idFromKey, searchResponseSchema, workSchema } from './schemas'

describe('Open Library şemaları', () => {
  it('anahtardan eser id’sini çıkarır', () => {
    expect(idFromKey('/works/OL893414W')).toBe('OL893414W')
    expect(idFromKey('/authors/OL79034A')).toBe('OL79034A')
  })

  it('eksik alanlı arama sonucunu güvenli varsayılanlara çevirir', () => {
    const result = searchResponseSchema.parse({
      numFound: 1,
      docs: [{ key: '/works/OL1W', title: 'Adsız' }],
    })
    expect(result).toEqual({
      total: 1,
      books: [{ id: 'OL1W', title: 'Adsız', authors: [], firstPublishYear: null, coverId: null }],
    })
  })

  it.each([
    ['düz metin', 'Arrakis çölünde geçer.'],
    ['{ type, value } nesnesi', { type: '/type/text', value: 'Arrakis çölünde geçer.' }],
  ])('açıklama %s olarak gelse de metne çevrilir', (_, description) => {
    const work = workSchema.parse({ key: '/works/OL1W', title: 'Dune', description })
    expect(work.description).toBe('Arrakis çölünde geçer.')
  })

  it('"kapak yok" işareti (-1) kapak sayılmaz', () => {
    const work = workSchema.parse({ key: '/works/OL1W', title: 'Dune', covers: [-1, 42] })
    expect(work.coverId).toBe(42)
    expect(coverUrl(-1)).toBeNull()
    expect(coverUrl(42, 'L')).toBe('https://covers.openlibrary.org/b/id/42-L.jpg')
  })

  it('beklenmeyen cevabı reddeder', () => {
    expect(searchResponseSchema.safeParse({ docs: 'yok' }).success).toBe(false)
  })
})
