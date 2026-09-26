import {
  createContext,
  useContext,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/shared/lib/cn'

interface TabsContextValue {
  value: string
  select: (value: string) => void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs(part: string) {
  const context = useContext(TabsContext)
  if (!context) throw new Error(`Tabs.${part}, <Tabs> içinde kullanılmalı.`)
  return context
}

const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`

export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string
  children: ReactNode
  className?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const baseId = useId()
  return (
    <TabsContext value={{ value, select: setValue, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext>
  )
}

function TabsList({
  children,
  className,
  'aria-label': label,
}: {
  children: ReactNode
  className?: string
  'aria-label': string
}) {
  // Sekme sırası DOM'dan okunur: veriye göre eklenen/çıkan sekmelerde indeks tablosu gerekmez.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    )
    const current = tabs.findIndex((tab) => tab === document.activeElement)
    if (current === -1) return
    const last = tabs.length - 1
    const next: Record<string, number> = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }
    if (!(event.key in next)) return
    event.preventDefault()
    // Otomatik etkinleştirme: focus alan sekme seçilir (Trigger'daki onFocus).
    tabs[next[event.key]].focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex gap-1 border-b border-slate-700', className)}
    >
      {children}
    </div>
  )
}

function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const tabs = useTabs('Trigger')
  const selected = tabs.value === value
  return (
    <button
      type="button"
      role="tab"
      id={tabId(tabs.baseId, value)}
      aria-controls={panelId(tabs.baseId, value)}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => tabs.select(value)}
      onFocus={() => tabs.select(value)}
      className={cn(
        '-mb-px border-b-2 border-transparent px-4 py-2 font-medium text-slate-400 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-brand-400 aria-selected:border-brand-500 aria-selected:text-inherit',
        className,
      )}
    >
      {children}
    </button>
  )
}

function TabsPanel({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const tabs = useTabs('Panel')
  return (
    <div
      role="tabpanel"
      id={panelId(tabs.baseId, value)}
      aria-labelledby={tabId(tabs.baseId, value)}
      hidden={tabs.value !== value}
      tabIndex={0}
      className={cn(
        'pt-4 focus-visible:outline-2 focus-visible:outline-brand-400',
        className,
      )}
    >
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Panel = TabsPanel
