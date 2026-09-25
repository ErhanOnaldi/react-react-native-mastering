import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
const Context = createContext<{ ids: number[]; toggle: (id: number) => void } | null>(null)
export function Provider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([])
  function toggle(id: number) {
    setIds((old) => (old.includes(id) ? old.filter((x) => x !== id) : [...old, id]))
  }
  return <Context value={{ ids, toggle }}>{children}</Context>
}
export function FavoriteToggle({ id }: { id: number }) {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Provider gerekli')
  return (
    <button type="button" onClick={() => ctx.toggle(id)}>
      {ctx.ids.includes(id) ? 'Favoriden çıkar' : 'Favoriye ekle'}
    </button>
  )
}
