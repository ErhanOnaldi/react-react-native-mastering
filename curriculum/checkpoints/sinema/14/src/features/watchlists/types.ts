export interface Watchlist {
  id: string
  createdAt: string
  name: string
  description: string
  isPublic: boolean
  tags: { value: string }[]
}

export type WatchlistValues = Omit<Watchlist, 'id' | 'createdAt'>
export type WatchlistPatch = Partial<WatchlistValues>
