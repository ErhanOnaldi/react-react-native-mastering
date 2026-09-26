import type { ReadingEntry } from './schemas'

export type ReadingListAction =
  | { type: 'upsert'; entry: ReadingEntry }
  | { type: 'remove'; workId: string }
  | { type: 'replace'; entries: ReadingEntry[] }

export function readingListReducer(
  state: ReadingEntry[],
  action: ReadingListAction,
): ReadingEntry[] {
  switch (action.type) {
    case 'upsert': {
      const exists = state.some((e) => e.workId === action.entry.workId)
      return exists
        ? state.map((e) => (e.workId === action.entry.workId ? action.entry : e))
        : [action.entry, ...state]
    }
    case 'remove':
      return state.filter((e) => e.workId !== action.workId)
    case 'replace':
      return action.entries
  }
}
