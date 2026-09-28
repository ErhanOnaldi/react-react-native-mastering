import { useSearchParams } from 'react-router'

const sections = ['Kıyı kasabası', 'Kayıp harita', 'Gece treni']

export function PageReader() {
  const [params, setParams] = useSearchParams()
  const rawPage = params.get('page') ?? '1'
  const page = Number(rawPage)

  return (
    <main>
      <p>Sayfa {page}</p>
      <h1>{sections[page - 1]}</h1>
      <button onClick={() => setParams({ page: rawPage + 1 })}>Sonraki sayfa</button>
    </main>
  )
}
