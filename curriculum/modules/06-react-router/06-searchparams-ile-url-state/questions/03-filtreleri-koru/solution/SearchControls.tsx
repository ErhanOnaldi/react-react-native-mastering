import { useSearchParams } from 'react-router'

export function SearchControls() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const rawPage = Number(params.get('page') ?? '1')
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1
  function change(key: 'q' | 'genre', value: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  }
  return (
    <>
      <input
        aria-label="Film ara"
        value={q}
        onChange={(event) => change('q', event.target.value)}
      />
      <button type="button" onClick={() => change('genre', '28')}>
        Aksiyon
      </button>
      <button type="button" onClick={() => change('genre', '')}>
        Tüm türler
      </button>
      <p>Sayfa {page}</p>
    </>
  )
}
