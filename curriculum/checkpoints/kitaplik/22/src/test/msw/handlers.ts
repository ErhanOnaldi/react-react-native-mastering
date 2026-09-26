import { http, HttpResponse, type JsonBodyType } from 'msw'
import { OPEN_LIBRARY_BASE } from '@/features/books/api/open-library'
import { duneWork, herbert, searchDocs, sucWork } from './fixtures'

const works = new Map<string, JsonBodyType>([
  ['OL893414W', duneWork],
  ['OL24252290W', sucWork],
])
const authors = new Map<string, JsonBodyType>([['OL79034A', herbert]])

/** "/works/OL1W.json" gibi bir kaydı bulur; yoksa Open Library biçiminde 404 döner. */
function respond(store: Map<string, JsonBodyType>, kind: string, file: unknown) {
  const id = String(file).replace(/\.json$/, '')
  const body = store.get(id)
  return body
    ? HttpResponse.json(body)
    : HttpResponse.json({ error: 'notfound', key: `/${kind}/${id}` }, { status: 404 })
}

export const handlers = [
  http.get(`${OPEN_LIBRARY_BASE}/search.json`, ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').toLocaleLowerCase('tr')
    const limit = Number(url.searchParams.get('limit') ?? 100)
    const page = Number(url.searchParams.get('page') ?? 1)
    const matches = searchDocs.filter((doc) =>
      [doc.title, ...(doc.author_name ?? [])].some((text) =>
        text.toLocaleLowerCase('tr').includes(q),
      ),
    )
    const start = (page - 1) * limit
    return HttpResponse.json({
      numFound: matches.length,
      start,
      docs: matches.slice(start, start + limit),
    })
  }),
  http.get(`${OPEN_LIBRARY_BASE}/works/:file`, ({ params }) =>
    respond(works, 'works', params.file),
  ),
  http.get(`${OPEN_LIBRARY_BASE}/authors/:file`, ({ params }) =>
    respond(authors, 'authors', params.file),
  ),
]
