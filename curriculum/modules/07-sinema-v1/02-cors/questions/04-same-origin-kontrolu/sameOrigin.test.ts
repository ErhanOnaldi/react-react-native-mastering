import { describe, expect, it } from 'vitest'
import { isSameOrigin } from '@exercise/sameOrigin'

describe('isSameOrigin', () => {
  it('üç alan eşleştiğinde true döner', () => {
    expect(
      isSameOrigin(
        { protocol: 'http:', host: 'localhost', port: '5173' },
        { protocol: 'http:', host: 'localhost', port: '5173' },
      ),
    ).toBe(true)
  })

  it('farklı portta false döner', () => {
    expect(
      isSameOrigin(
        { protocol: 'http:', host: 'localhost', port: '5173' },
        { protocol: 'http:', host: 'localhost', port: '5000' },
      ),
    ).toBe(false)
  })

  it('farklı protokolde false döner', () => {
    expect(
      isSameOrigin(
        { protocol: 'http:', host: 'localhost', port: '5173' },
        { protocol: 'https:', host: 'localhost', port: '5173' },
      ),
    ).toBe(false)
  })

  it('farklı hostta false döner', () => {
    expect(
      isSameOrigin(
        { protocol: 'http:', host: 'localhost', port: '5173' },
        { protocol: 'http:', host: '127.0.0.1', port: '5173' },
      ),
    ).toBe(false)
  })
})
