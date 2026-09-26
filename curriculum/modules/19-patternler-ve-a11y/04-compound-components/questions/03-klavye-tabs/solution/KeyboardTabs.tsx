import { createContext, useContext, useId, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
const Context = createContext<{ value: string; setValue: (v: string) => void; id: string } | null>(
  null,
)
function useTabs() {
  const value = useContext(Context)
  if (!value) throw new Error('KeyboardTabs parçaları kök içinde olmalı')
  return value
}
function Root({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  const id = useId()
  return <Context value={{ value, setValue, id }}>{children}</Context>
}
function List({ children, 'aria-label': label }: { children: ReactNode; 'aria-label': string }) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (current < 0) return
    let next = current
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    tabs[next]?.focus()
    tabs[next]?.click()
  }
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      {children}
    </div>
  )
}
function Trigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useTabs()
  const selected = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.id}-tab-${value}`}
      aria-controls={`${ctx.id}-panel-${value}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  )
}
function Panel({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useTabs()
  return (
    <div
      role="tabpanel"
      id={`${ctx.id}-panel-${value}`}
      aria-labelledby={`${ctx.id}-tab-${value}`}
      hidden={ctx.value !== value}
    >
      {children}
    </div>
  )
}
export const KeyboardTabs = Object.assign(Root, { List, Trigger, Panel })
