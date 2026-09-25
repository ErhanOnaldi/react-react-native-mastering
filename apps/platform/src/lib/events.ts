import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { ServerEvent } from '@rm/server/dto'

type Handler = (event: ServerEvent) => void
const handlers = new Set<Handler>()
let source: EventSource | undefined

function ensureSource() {
  if (source) return
  source = new EventSource('/api/events')
  const dispatch = (e: MessageEvent<string>) => {
    const event = JSON.parse(e.data) as ServerEvent
    for (const h of handlers) h(event)
  }
  source.addEventListener('file-changed', dispatch)
  source.addEventListener('curriculum-changed', dispatch)
}

/** Sunucu olaylarına abone olur (tek bir paylaşımlı EventSource bağlantısı). */
export function useServerEvents(handler: Handler) {
  useEffect(() => {
    ensureSource()
    handlers.add(handler)
    return () => {
      handlers.delete(handler)
    }
  }, [handler])
}

/** İçerik değişince tüm sorguları tazeler (içerik yazarken canlı yenileme). */
export function useCurriculumLiveReload() {
  const queryClient = useQueryClient()
  useEffect(() => {
    ensureSource()
    const handler: Handler = (event) => {
      if (event.type === 'curriculum-changed') void queryClient.invalidateQueries()
    }
    handlers.add(handler)
    return () => {
      handlers.delete(handler)
    }
  }, [queryClient])
}
