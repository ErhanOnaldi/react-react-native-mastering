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
      className={cn('flex gap-1 border-b', className)}
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
        '-mb-px rounded-t-md border-b-2 border-transparent px-4 py-2 font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-selected:border-primary aria-selected:text-foreground',
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
        'rounded-md pt-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
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
