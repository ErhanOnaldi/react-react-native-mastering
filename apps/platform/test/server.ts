import { setupServer } from 'msw/node'

// Platform testleri için sahte /api sunucusu; her test kendi handler'larını server.use ile ekler.
export const server = setupServer()
