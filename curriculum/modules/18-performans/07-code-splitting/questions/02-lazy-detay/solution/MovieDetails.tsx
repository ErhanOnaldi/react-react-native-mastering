import { Suspense, lazy } from 'react'
const CastPanel = lazy(() => import('./CastPanel'))
export function MovieDetails() {
  return (
    <section>
      <h2>Film detayı</h2>
      <Suspense fallback={<p>Oyuncular yükleniyor</p>}>
        <CastPanel />
      </Suspense>
    </section>
  )
}
