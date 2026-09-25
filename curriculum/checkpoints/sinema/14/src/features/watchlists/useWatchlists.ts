import { useEffect, useState } from 'react'
import type { Watchlist, WatchlistValues } from './types'

const storageKey = 'sinema:watchlists'
const changeEvent = 'sinema:watchlists-changed'

function readWatchlists(): Watchlist[] {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? (JSON.parse(stored) as Watchlist[]) : []
  } catch {
    return []
  }
}

export function useWatchlists() {
  const [watchlists, setWatchlists] = useState(readWatchlists)

  useEffect(() => {
    const refresh = () => setWatchlists(readWatchlists())
    window.addEventListener(changeEvent, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(changeEvent, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  function addWatchlist(values: WatchlistValues) {
    const next = [
      ...readWatchlists(),
      {
        ...values,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(storageKey, JSON.stringify(next))
    setWatchlists(next)
    window.dispatchEvent(new Event(changeEvent))
  }

  return { watchlists, addWatchlist }
}
