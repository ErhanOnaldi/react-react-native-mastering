import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
const Context = createContext<{ value: string; setValue: (v: string) => void } | null>(null)
function useTabs() {
  const context = useContext(Context)
  if (!context) throw new Error('Tabs parçaları Tabs içinde olmalı')
  return context
}
function Root({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  return <Context value={{ value, setValue }}>{children}</Context>
}
function List({ children, 'aria-label': label }: { children: ReactNode; 'aria-label': string }) {
  return (
    <div role="tablist" aria-label={label}>
      {children}
    </div>
  )
}
function Trigger({ value, children }: { value: string; children: ReactNode }) {
  const tabs = useTabs()
  return (
    <button
      type="button"
      role="tab"
      aria-selected={tabs.value === value}
      onClick={() => tabs.setValue(value)}
    >
      {children}
    </button>
  )
}
function Panel({ value, children }: { value: string; children: ReactNode }) {
  const tabs = useTabs()
  return tabs.value === value ? <div role="tabpanel">{children}</div> : null
}
export const Tabs = Object.assign(Root, { List, Trigger, Panel })
