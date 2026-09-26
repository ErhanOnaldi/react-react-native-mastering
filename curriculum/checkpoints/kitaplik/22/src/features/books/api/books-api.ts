import { openLibraryGet } from './open-library'
import { authorSchema, searchResponseSchema, workSchema } from './schemas'

/** Ürün kararı: sayfa başına 10 kitap (REQUIREMENTS.md → K-3). */
export const SEARCH_PAGE_SIZE = 10

export interface SearchParams {
  q: string
  page: number
}

export function searchBooks({ q, page }: SearchParams, signal?: AbortSignal) {
  return openLibraryGet('/search.json', searchResponseSchema, {
    params: {
      q,
      page,
      limit: SEARCH_PAGE_SIZE,
      // Open Library her kitap için onlarca alan döndürür; sadece kullandıklarımızı isteriz
      fields: 'key,title,author_name,first_publish_year,cover_i',
    },
    signal,
  })
}

export function getWork(workId: string, signal?: AbortSignal) {
  return openLibraryGet(`/works/${workId}.json`, workSchema, { signal })
}

export function getAuthor(authorId: string, signal?: AbortSignal) {
  return openLibraryGet(`/authors/${authorId}.json`, authorSchema, { signal })
}
