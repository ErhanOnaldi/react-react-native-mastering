import { Link } from 'react-router'
import { searchHref } from '../search-params'

const suggestions = ['Dune', 'Suç ve Ceza', 'Frank Herbert']

export function HomePage() {
  return (
    <section className="space-y-6 py-10 text-center">
      <div className="space-y-2">
        <h1 className="font-serif text-5xl font-bold text-ink">Kitaplık</h1>
        <p className="text-lg text-stone-600">Ne okusak?</p>
      </div>
      <p className="text-stone-600">
        Yukarıdaki kutuya bir kitap adı ya da yazar yaz. Aklına gelmiyorsa:
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {suggestions.map((q) => (
          <li key={q}>
            <Link
              to={searchHref({ q })}
              className="rounded-full border border-stone-300 px-3 py-1 text-sm hover:border-accent-500"
            >
              {q}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
