// Sahte Open Library (https://openlibrary.org): arama, eser ve yazar detayı. Anahtar gerektirmez.
// Bitirme modülünde (22) kullanılır. Veriler gerçek cevaplardan örneklenmiştir.
import { delay, http, HttpResponse } from 'msw'
import authorHerbert from '../../fixtures/openlibrary/author-OL79034A.json'
import searchDune from '../../fixtures/openlibrary/search-dune.json'
import searchSuc from '../../fixtures/openlibrary/search-suc-ve-ceza.json'
import workSuc from '../../fixtures/openlibrary/work-OL24252290W.json'
import workDune from '../../fixtures/openlibrary/work-OL893414W.json'

export const OPENLIBRARY_BASE = 'https://openlibrary.org'

export interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  author_key?: string[]
  first_publish_year?: number
  cover_i?: number
  edition_count?: number
  language?: string[]
  subject?: string[]
}

const books: OpenLibraryDoc[] = [...searchDune.docs, ...searchSuc.docs] as OpenLibraryDoc[]
const works = new Map<string, unknown>([
  ['OL893414W', workDune],
  ['OL24252290W', workSuc],
])
const authors = new Map<string, unknown>([['OL79034A', authorHerbert]])

function normalize(text: string) {
  return text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export const openLibraryHandlers = [
  http.get(`${OPENLIBRARY_BASE}/search.json`, async ({ request }) => {
    await delay()
    const url = new URL(request.url)
    const q = normalize(url.searchParams.get('q')?.trim() ?? '')
    const limit = Math.min(100, Number(url.searchParams.get('limit') ?? 20) || 20)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
    const matches = q
      ? books.filter(
          (b) =>
            normalize(b.title).includes(q) ||
            (b.author_name ?? []).some((a) => normalize(a).includes(q)),
        )
      : []
    const start = (page - 1) * limit
    return HttpResponse.json({
      numFound: matches.length,
      start,
      numFoundExact: true,
      docs: matches.slice(start, start + limit),
      q: url.searchParams.get('q') ?? '',
    })
  }),

  http.get(`${OPENLIBRARY_BASE}/works/:id`, async ({ params }) => {
    await delay()
    const id = String(params.id).replace(/\.json$/, '')
    const work = works.get(id)
    if (work) return HttpResponse.json(work)
    const doc = books.find((b) => b.key === `/works/${id}`)
    if (!doc) return HttpResponse.json({ error: 'notfound', key: `/works/${id}` }, { status: 404 })
    return HttpResponse.json({
      key: doc.key,
      title: doc.title,
      authors: (doc.author_key ?? []).map((k) => ({ author: { key: `/authors/${k}` } })),
      covers: doc.cover_i ? [doc.cover_i] : [],
      subjects: doc.subject?.slice(0, 10) ?? [],
    })
  }),

  http.get(`${OPENLIBRARY_BASE}/authors/:id`, async ({ params }) => {
    await delay()
    const id = String(params.id).replace(/\.json$/, '')
    const author = authors.get(id)
    return author
      ? HttpResponse.json(author)
      : HttpResponse.json({ error: 'notfound', key: `/authors/${id}` }, { status: 404 })
  }),
]
