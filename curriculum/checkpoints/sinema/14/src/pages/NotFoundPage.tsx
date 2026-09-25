import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">404 — Sayfa bulunamadı</h2>
      <p>Bu adreste bir sayfa yok.</p>
      <Link to="/" className="underline underline-offset-4">
        Ana sayfaya dön
      </Link>
    </div>
  )
}
