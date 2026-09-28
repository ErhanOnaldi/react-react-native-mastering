import { useSearchParams } from 'react-router'

const sections = ['Kıyı kasabası', 'Kayıp harita', 'Gece treni']

function readPage(value: string | null): number {
  if (!value || !/^\d+$/.test(value)) return 1
  const page = Number(value)
  return Number.isSafeInteger(page) && page >= 1 && page <= sections.length ? page : 1
}

export function PageReader() {
  const [params, setParams] = useSearchParams()
  const page = readPage(params.get('page'))

  function nextPage() {
    setParams((current) => {
      const next = new URLSearchParams(current)
      next.set('page', String(Math.min(page + 1, sections.length)))
      return next
    })
  }

  return (
    <main>
      <p>Sayfa {page}</p>
      <h1>{sections[page - 1]}</h1>
      <button onClick={nextPage}>Sonraki sayfa</button>
    </main>
  )
}
