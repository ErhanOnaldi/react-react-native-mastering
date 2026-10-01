import { afterEach, describe, expect, it, vi } from 'vitest'
import { schedule } from '@impl/schedule'

afterEach(() => vi.useRealTimers())

describe('schedule', () => {
  it('callback’i 500 ms dolmadan çalıştırmaz ve süre dolunca çalıştırır', () => {
    vi.useFakeTimers()
    const callback = vi.fn()

    schedule(callback, 500)
    vi.advanceTimersByTime(499)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
