import { beforeEach, describe, expect, it } from 'vitest'
import type { ReadingEntry } from './schemas'
import { loadReadingList, READING_LIST_STORAGE_KEY, saveReadingList } from './storage'

const entry: ReadingEntry = {
  workId: 'OL893414W',
  title: 'Dune',
  authors: ['Frank Herbert'],
  coverId: 11481354,
  status: 'read',
  rating: 5,
  note: '',
  updatedAt: '2026-09-25T10:00:00.000Z',
}

describe('okuma listesi deposu', () => {
  beforeEach(() => localStorage.clear())

  it('kaydettiğini geri okur', () => {
    saveReadingList([entry])
    expect(loadReadingList()).toEqual([entry])
  })

  it.each([
    ['bozuk JSON', '{bozuk'],
    ['yanlış biçim', '[{"id":1}]'],
    ['dizi olmayan değer', '"merhaba"'],
  ])('%s karşısında çökmez, boş liste döner', (_, raw) => {
    localStorage.setItem(READING_LIST_STORAGE_KEY, raw)
    expect(loadReadingList()).toEqual([])
  })

  it('okunmuş ama puansız eski kaydı reddeder', () => {
    localStorage.setItem(READING_LIST_STORAGE_KEY, JSON.stringify([{ ...entry, rating: null }]))
    expect(loadReadingList()).toEqual([])
  })
})
