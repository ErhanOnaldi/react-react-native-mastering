import { useSearchParams } from 'react-router'

export function SearchControls() {
  const [params, setParams] = useSearchParams()
  return (
    <>
      <input aria-label="Film ara" defaultValue={params.get('q') ?? ''} />
      <button type="button">Aksiyon</button>
      <p>Sayfa {params.get('page') ?? '1'}</p>
    </>
  )
}
