// Tüm egzersiz testlerinden önce çalışan ortak kurulum.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { resetDummyJsonState } from './msw/dummyjson.ts'
import { server } from './msw/node.ts'
import { resetTmdbState } from './msw/tmdb.ts'
import { clearRequests } from './request-log.ts'

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
