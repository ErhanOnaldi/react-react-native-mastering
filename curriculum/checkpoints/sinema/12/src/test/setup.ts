import process from 'node:process'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/test/msw/handlers'

export const server = setupServer(...handlers)

beforeAll(() => {
  // Proje görevleri ortak test ortamının MSW sunucusunu zaten başlatır.
  if (!process.env.RM_PROJECT_DIR) server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
