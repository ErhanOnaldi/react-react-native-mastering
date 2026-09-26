import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { ReadingListContext, type ReadingListValue } from './reading-list-context'
import { readingListReducer } from './reading-list-reducer'
import { loadReadingList, READING_LIST_STORAGE_KEY, saveReadingList } from './storage'

export function ReadingListProvider({ children }: { children: ReactNode }) {
  const [entries, dispatch] = useReducer(readingListReducer, undefined, () => loadReadingList())

  // Tek yön: state değişir → localStorage'a yazılır
  useEffect(() => {
    saveReadingList(entries)
  }, [entries])

  // Başka sekmede liste değişirse bu sekme de güncellensin
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === READING_LIST_STORAGE_KEY) {
        dispatch({ type: 'replace', entries: loadReadingList() })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo<ReadingListValue>(
    () => ({
      entries,
      getEntry: (workId) => entries.find((e) => e.workId === workId),
      upsert: (entry) => dispatch({ type: 'upsert', entry }),
      remove: (workId) => dispatch({ type: 'remove', workId }),
    }),
    [entries],
  )

  return <ReadingListContext value={value}>{children}</ReadingListContext>
}
