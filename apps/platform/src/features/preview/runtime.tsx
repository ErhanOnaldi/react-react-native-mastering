// Önizleme iframe'inin içinde çalışır: sahte TMDB API'sini (MSW) başlatır, istekleri sayar,
// öğrencinin bileşenini render eder ve olanları platforma bildirir.
import { Component, type ComponentType, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { setupWorker } from 'msw/browser'
import { handlers } from '@test-env/msw/handlers'
import type { PreviewMessage } from './messages'
import './preview.css'

const LIMIT = 100
const post = (message: PreviewMessage) =>
  window.parent.postMessage({ source: 'rm-preview', ...message }, window.location.origin)

let root: Root | undefined
let count = 0
let halted = false
const originalFetch = window.fetch.bind(window)

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (halted) return new Promise<Response>(() => {})
  count += 1
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const method = init?.method ?? (input instanceof Request ? input.method : 'GET')
  post({ type: 'request', count, method: method.toUpperCase(), url, at: Date.now() })
  if (count >= LIMIT) {
    halted = true
    post({ type: 'halted', count })
    root?.unmount()
    return new Promise<Response>(() => {})
  }
  return originalFetch(input, init)
}

window.addEventListener('error', (e) => post({ type: 'error', message: e.message }))
window.addEventListener('unhandledrejection', (e) =>
  post({ type: 'error', message: String((e.reason as Error)?.message ?? e.reason) }),
)

const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
if (memory) {
  setInterval(() => post({ type: 'heap', usedMb: memory.usedJSHeapSize / 1024 / 1024 }), 1000)
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  override state: { error?: Error } = {}
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  override componentDidCatch(error: Error) {
    post({ type: 'error', message: error.message })
  }
  override render() {
    if (this.state.error) {
      return (
        <div
          style={{
            color: '#be123c',
            fontFamily: 'ui-monospace, monospace',
            whiteSpace: 'pre-wrap',
          }}
        >
          <strong>Render hatası</strong>
          {'\n'}
          {this.state.error.message}
        </div>
      )
    }
    return this.props.children
  }
}

async function start() {
  // Yalnızca soru kodu kabul edilir; yüklenecek modülü sunucu belirler (rastgele URL import edilmez)
  const code = new URLSearchParams(window.location.search).get('q')
  if (!code || !/^\d+(\.\d+){2}$/.test(code)) throw new Error('Geçersiz soru kodu')
  const response = await originalFetch(`/api/questions/${code}/preview`, {
    headers: { 'x-rm-client': '1' },
  })
  if (!response.ok) throw new Error('Önizleme bilgisi alınamadı')
  const { modulePath } = (await response.json()) as { modulePath: string }
  if (!modulePath.startsWith('/@fs/')) throw new Error('Geçersiz önizleme yolu')
  await setupWorker(...handlers).start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest: 'bypass',
    quiet: true,
  })
  const mod = (await import(/* @vite-ignore */ modulePath)) as { default?: ComponentType }
  if (!mod.default) throw new Error(`${modulePath.split('/').pop()} bir default export içermiyor`)
  const Preview = mod.default
  root = createRoot(document.getElementById('root')!)
  root.render(
    <ErrorBoundary>
      <Preview />
    </ErrorBoundary>,
  )
}

start().catch((error: Error) => post({ type: 'error', message: error.message }))
