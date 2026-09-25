import { setupServer } from 'msw/node'
import { recordRequest } from '../request-log.ts'
import { handlers } from './handlers.ts'

export const server = setupServer(...handlers)

server.events.on('request:start', ({ request }) => {
  recordRequest(request)
})
