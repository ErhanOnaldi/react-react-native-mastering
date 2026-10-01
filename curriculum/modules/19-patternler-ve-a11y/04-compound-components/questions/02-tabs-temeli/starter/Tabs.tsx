import type { ReactNode } from 'react'

interface RootProps {
  defaultValue: string
  children: ReactNode
}

interface ListProps {
  children: ReactNode
  'aria-label': string
}

interface ValueProps {
  value: string
  children: ReactNode
}

type TabsApi = ((props: RootProps) => ReactNode) & {
  List: (props: ListProps) => ReactNode
  Trigger: (props: ValueProps) => ReactNode
  Panel: (props: ValueProps) => ReactNode
}

// Bu başlangıç yalnızca dış API biçimini belirtir; içerik ve ortak state'i sen kur.
export const Tabs = (() => null) as TabsApi
