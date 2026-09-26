import { createContext } from 'react'
import type { ReadingEntry } from './schemas'

export interface ReadingListValue {
  entries: ReadingEntry[]
  getEntry: (workId: string) => ReadingEntry | undefined
  upsert: (entry: ReadingEntry) => void
  remove: (workId: string) => void
}

export const ReadingListContext = createContext<ReadingListValue | null>(null)
