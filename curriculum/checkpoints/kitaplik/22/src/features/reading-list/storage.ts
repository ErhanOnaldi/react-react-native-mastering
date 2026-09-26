import { readingListSchema, type ReadingEntry } from './schemas'

export const READING_LIST_STORAGE_KEY = 'kitaplik:reading-list'

/**
 * Kayıtlı listeyi okur. Bozuk JSON, eski biçim ya da elle oynanmış veri uygulamayı
 * çökertmez: geçersizse boş liste döner.
 */
export function loadReadingList(storage: Storage = localStorage): ReadingEntry[] {
  try {
    const raw = storage.getItem(READING_LIST_STORAGE_KEY)
    if (!raw) return []
    const parsed = readingListSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

export function saveReadingList(entries: ReadingEntry[], storage: Storage = localStorage) {
  try {
    storage.setItem(READING_LIST_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Kota dolu / gizli pencere: liste bu oturumda bellekte yaşamaya devam eder
  }
}
