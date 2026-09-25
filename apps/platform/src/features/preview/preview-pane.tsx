import { Activity, Network, OctagonAlert, RefreshCw } from 'lucide-react'
import { useEffect, useReducer, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import type { PreviewMessage } from './messages'

interface PreviewState {
  count: number
  requests: { method: string; url: string; at: number }[]
  halted: boolean
  error?: string
  heapMb?: number
}

const initial: PreviewState = { count: 0, requests: [], halted: false }

function reducer(state: PreviewState, message: PreviewMessage): PreviewState {
  switch (message.type) {
    case 'request':
      return {
        ...state,
        count: message.count,
        requests: [
          { method: message.method, url: message.url, at: message.at },
          ...state.requests,
        ].slice(0, 50),
      }
    case 'halted':
      return { ...state, halted: true, count: message.count }
    case 'error':
      return { ...state, error: message.message }
    case 'heap':
      return { ...state, heapMb: message.usedMb }
  }
}

function shortUrl(url: string) {
  try {
    const u = new URL(url)
    return `${u.pathname}${u.search}`
  } catch {
    return url
  }
}

/** Tek bir iframe oturumu. key değişince (kaydetme/yeniden başlatma) sayaçlar sıfırdan başlar. */
function PreviewSession({ modulePath, onRestart }: { modulePath: string; onRestart: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [state, dispatch] = useReducer(reducer, initial)
  const [showLog, setShowLog] = useState(false)

  useEffect(() => {
    const onMessage = (event: MessageEvent<PreviewMessage & { source?: string }>) => {
      if (event.source !== iframeRef.current?.contentWindow || event.data?.source !== 'rm-preview')
        return
      dispatch(event.data)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const src = `/preview.html?module=${encodeURIComponent(modulePath)}`
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border px-3 text-xs">
        <span
          className={cn(
            'flex items-center gap-1.5 font-mono tabular-nums',
            state.count > 20 ? 'text-danger' : state.count > 3 ? 'text-warning' : 'text-muted',
          )}
          aria-live="polite"
        >
          <Network className="size-3.5" /> İstek: {state.count}
        </span>
        {state.heapMb !== undefined && (
          <span className="flex items-center gap-1.5 font-mono text-muted tabular-nums">
            <Activity className="size-3.5" /> Bellek: {state.heapMb.toFixed(1)} MB
          </span>
        )}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLog((s) => !s)}
          aria-pressed={showLog}
        >
          Ağ log'u
        </Button>
        <Button variant="ghost" size="sm" onClick={onRestart}>
          <RefreshCw /> Yeniden başlat
        </Button>
      </div>
      <div className="relative min-h-0 flex-1">
        <iframe ref={iframeRef} title="Önizleme" src={src} className="h-full w-full bg-white" />
        {state.halted && (
          <div className="absolute inset-0 grid place-items-center bg-bg/85 p-6 backdrop-blur-sm">
            <div className="max-w-sm rounded-xl border border-danger/40 bg-surface p-5 text-center">
              <OctagonAlert className="mx-auto size-8 text-danger" />
              <p className="mt-2 font-semibold">Sonsuz istek döngüsü tespit edildi</p>
              <p className="mt-1 text-sm text-muted">
                Önizleme {state.count} istekte durduruldu. Bileşenin her render'da yeniden istek
                atıyor olabilir mi?
              </p>
              <Button className="mt-4" onClick={onRestart}>
                <RefreshCw /> Yeniden başlat
              </Button>
            </div>
          </div>
        )}
        {state.error && !state.halted && (
          <div className="absolute inset-x-3 bottom-3 rounded-lg border border-danger/40 bg-surface p-3 text-sm shadow-lg">
            <p className="font-semibold text-danger">Önizlemede hata</p>
            <pre className="mt-1 max-h-32 overflow-auto font-mono text-xs whitespace-pre-wrap">
              {state.error}
            </pre>
          </div>
        )}
        {showLog && (
          <div className="absolute inset-y-0 right-0 w-80 overflow-y-auto border-l border-border bg-surface text-xs shadow-xl">
            {state.requests.length === 0 ? (
              <p className="p-3 text-muted">Henüz istek yok.</p>
            ) : (
              <ol>
                {state.requests.map((r, i) => (
                  <li key={`${r.at}-${i}`} className="border-b border-border px-3 py-1.5 font-mono">
                    <span className="text-accent">{r.method}</span> {shortUrl(r.url)}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function PreviewPane({ modulePath, version }: { modulePath: string; version: number }) {
  const [restarts, setRestarts] = useState(0)
  return (
    <PreviewSession
      key={`${version}-${restarts}`}
      modulePath={modulePath}
      onRestart={() => setRestarts((r) => r + 1)}
    />
  )
}
