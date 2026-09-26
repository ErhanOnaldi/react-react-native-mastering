import type { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

interface SearchDoc {
  key: string
  title: string
}

interface SearchResponse {
  docs: SearchDoc[]
}

export function BookSearch() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)

  const result = useQuery({
    queryKey: ['books', 'search', query, page],
    queryFn: async (): Promise<SearchResponse> => {
      const url = new URL('https://openlibrary.org/search.json')
      url.searchParams.set('q', query)
      url.searchParams.set('limit', '1')
      url.searchParams.set('page', String(page))
      const response = await fetch(url)
      if (!response.ok) throw new Error('Arama yüklenemedi')
      return response.json()
    },
    enabled: query.trim().length > 0,
    staleTime: 60_000,
  })

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = new FormData(event.currentTarget).get('q')
    setParams({ q: String(input ?? ''), page: '1' })
  }

  const book = result.data?.docs[0]

  return (
    <section>
      <form onSubmit={handleSearch}>
        <label>
          Kitap ara
          <input name="q" defaultValue={query} />
        </label>
        <button type="submit">Ara</button>
      </form>
      <button disabled={page === 1} onClick={() => setParams({ q: query, page: String(page - 1) })}>
        Önceki sayfa
      </button>
      <button onClick={() => setParams({ q: query, page: String(page + 1) })}>Sonraki sayfa</button>
      <p>Sayfa {page}</p>
      {result.isPending && query && <p>Yükleniyor</p>}
      {result.isError && <p role="alert">Arama yüklenemedi</p>}
      {result.isSuccess && (book ? <p>{book.title}</p> : <p>Kitap bulunamadı</p>)}
    </section>
  )
}
