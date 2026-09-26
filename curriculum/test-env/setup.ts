// Tüm egzersiz testlerinden önce çalışan ortak kurulum.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { resetDummyJsonState } from './msw/dummyjson.ts'
import { server } from './msw/node.ts'
import { resetTmdbState } from './msw/tmdb.ts'
import { clearRequests } from './request-log.ts'

// jsdom'da olmayan tarayıcı API'leri: Radix gibi kütüphaneler bunları kullanır.
// (Gerçek projelerde de test setup dosyasına aynı küçük polyfill'ler eklenir.)
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}
if (typeof Element !== 'undefined') {
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.releasePointerCapture ??= () => {}
  Element.prototype.scrollIntoView ??= () => {}
}

beforeAll(() => {
  // Tanımlanmamış bir adrese istek atılırsa test hata verir: testler gerçek ağa asla çıkmaz.
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  clearRequests()
  resetTmdbState()
  resetDummyJsonState()
})

afterAll(() => {
  server.close()
})
