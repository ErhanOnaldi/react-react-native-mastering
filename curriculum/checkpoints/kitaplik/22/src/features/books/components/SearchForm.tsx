import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { readSearchParams, searchHref } from '../search-params'

/**
 * Arama, form gönderilince yapılır (her tuşta değil): Open Library gönüllülerin
 * işlettiği ücretsiz bir servis. URL tek doğruluk kaynağı; input URL'den beslenir.
 */
export function SearchForm() {
  const [searchParams] = useSearchParams()
  const { q } = readSearchParams(searchParams)
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('q')
    const query = typeof value === 'string' ? value.trim() : ''
    if (!query) return
    // Yeni arama her zaman 1. sayfadan başlar
    navigate(searchHref({ q: query }))
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <label htmlFor="book-search" className="sr-only">
        Kitap ara
      </label>
      {/* key: URL'deki sorgu değişince (geri tuşu) input da yeni değerle baştan kurulur */}
      <input
        key={q}
        id="book-search"
        name="q"
        type="search"
        defaultValue={q}
        placeholder="Kitap adı ya da yazar…"
        className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-ink placeholder:text-stone-400 focus:outline-2 focus:outline-accent-500"
      />
      <button
        type="submit"
        className="rounded-md bg-ink px-4 py-2 font-medium text-paper hover:bg-stone-700"
      >
        Ara
      </button>
    </form>
  )
}
