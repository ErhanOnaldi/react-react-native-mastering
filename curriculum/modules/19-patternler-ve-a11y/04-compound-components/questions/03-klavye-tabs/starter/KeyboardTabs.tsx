import { createContext, useContext, useId, useState } from 'react'
import type { ReactNode } from 'react'
const Context = createContext<{ value: string; setValue: (v: string) => void; id: string } | null>(
  null,
)
function Root({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  const id = useId()
  return <Context value={{ value, setValue, id }}>{children}</Context>
}
function List({ children, 'aria-label': label }: { children: ReactNode; 'aria-label': string }) {
  return (
    <div role="tablist" aria-label={label}>
      {children}
    </div>
  )
}
function Trigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(Context)!
  return (
    <button
      type="button"
      role="tab"
      aria-selected={ctx.value === value}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  )
}
function Panel({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(Context)!
  return (
    <div role="tabpanel" hidden={ctx.value !== value}>
      {children}
    </div>
  )
}
export const KeyboardTabs = Object.assign(Root, { List, Trigger, Panel })
