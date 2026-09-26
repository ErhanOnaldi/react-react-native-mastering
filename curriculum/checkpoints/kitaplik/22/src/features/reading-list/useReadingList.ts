import { use } from 'react'
import { ReadingListContext } from './reading-list-context'

export function useReadingList() {
  const value = use(ReadingListContext)
  if (!value) throw new Error('useReadingList, ReadingListProvider içinde kullanılmalı.')
  return value
}
