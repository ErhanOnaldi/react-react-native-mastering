import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, tmdbClient } from '@project/src/shared/api/tmdb-client'
import { useDebounce } from '@project/src/hooks/useDebounce'

const root = process.env.RM_PROJECT_DIR!

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('Sinema client ve debounce testleri', () => {
  it('iki test dosyası assertion, mock ve fake timer içerir', () => {
    const clientPath = join(root, 'src/shared/api/tmdb-client.test.ts')
    const hookPath = join(root, 'src/hooks/useDebounce.test.ts')
    expect(existsSync(clientPath)).toBe(true)
    expect(existsSync(hookPath)).toBe(true)
    const client = readFileSync(clientPath, 'utf8')
    const hook = readFileSync(hookPath, 'utf8')
    expect(client).toMatch(/\bexpect\s*\(/)
    expect(client).toMatch(/\bvi\.(?:fn|spyOn)\s*\(/)
    expect(hook).toMatch(/\bexpect\s*\(/)
    expect(hook).toMatch(/\bvi\.useFakeTimers\s*\(/)
    expect(hook).toMatch(/\bvi\.useRealTimers\s*\(/)
  })

  it('client ikinci sayfa isteğine Bearer ekler ve cevabı döner', async () => {
    const fake = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ results: [{ id: 550, title: 'Dövüş Kulübü' }] }))
    vi.stubGlobal('fetch', fake)
    const result = await tmdbClient.get<{ results: { id: number; title: string }[] }>(
      '/search/movie',
      { query: 'Dövüş', page: 2 },
    )
    expect(fake).toHaveBeenCalledTimes(1)
    const [input, init] = fake.mock.calls[0]
    const url = new URL(String(input))
    expect(url.pathname).toBe('/3/search/movie')
    expect(url.searchParams.get('query')).toBe('Dövüş')
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.get('language')).toBe('tr-TR')
    expect(new Headers(init?.headers).get('Authorization')).toMatch(/^Bearer\s+\S+$/)
    expect(result.results).toEqual([{ id: 550, title: 'Dövüş Kulübü' }])
  })

  it('client 404 cevabını ApiError alanlarıyla taşır', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          Response.json({ status_code: 34, status_message: 'Film bulunamadı' }, { status: 404 }),
        ),
    )
    await expect(tmdbClient.get('/movie/999999')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      statusCode: 34,
      message: 'Film bulunamadı',
    } satisfies Partial<ApiError>)
  })

  it('hook son değeri bekler ve önceki timer’ı temizler', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: '' },
    })
    rerender({ value: 'ba' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'başlangıç' })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('')
    act(() => vi.advanceTimersByTime(199))
    expect(result.current).toBe('')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('başlangıç')
  })
})
