import { useSearchParams } from 'react-router'

const sections = ['Kıyı kasabası', 'Kayıp harita', 'Gece treni']

export function PageReader() {
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')
  if (!Number.isInteger(page) || page < 1 || page > sections.length) {
    throw new Error('Geçersiz sayfa')
  }
  return (
    <main>
      <p>Sayfa {page}</p>
      <h1>{sections[page - 1]}</h1>
      <button onClick={() => setParams({ page: String(page + 1) })}>Sonraki sayfa</button>
    </main>
  )
}
