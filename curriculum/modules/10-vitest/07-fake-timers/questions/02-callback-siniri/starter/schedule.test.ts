import { afterEach, describe, it, vi } from 'vitest'
import { schedule } from '@impl/schedule'

afterEach(() => vi.useRealTimers())

describe('Zamanlayıcı callback’ini test et', () => {
  it.todo('callback’i 500 ms dolmadan çalıştırmaz ve süre dolunca çalıştırır')
})
