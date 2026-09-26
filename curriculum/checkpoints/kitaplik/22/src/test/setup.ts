import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './msw/server'

// Tanımsız bir adrese istek giderse test hata versin: testler asla gerçek Open Library'ye çıkmaz
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  cleanup() // globals: false → RTL temizliği otomatik değil
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())
