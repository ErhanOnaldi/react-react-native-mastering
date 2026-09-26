import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="space-y-3 py-10 text-center">
      <h1 className="font-serif text-3xl font-semibold">Sayfa bulunamadı</h1>
      <Link to="/" className="text-accent-600 underline">
        Ana sayfaya dön
      </Link>
    </section>
  )
}
