// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { Page, Route, Request } from '@playwright/test'
import { mockSearch } from '@exercise/mockSearch'

type Fulfillment = { status?: number; json?: unknown }
async function request(query: string, authorization?: string) {
  let handler: ((route: Route) => Promise<unknown> | unknown) | undefined
  const page = {
    route: async (_pattern: string, callback: typeof handler) => {
      handler = callback
    },
  } as unknown as Page
  await mockSearch(page)
  expect(handler, 'page.route callback kurulmalı').toBeTypeOf('function')
  let answer: Fulfillment | undefined
  const route = {
    request: () =>
      ({
        url: () => `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
        headers: () => (authorization ? { authorization } : {}),
        method: () => 'GET',
      }) as unknown as Request,
    fulfill: async (options: Fulfillment) => {
      answer = options
    },
  } as unknown as Route
  await handler!(route)
  return answer
}

describe('mockSearch', () => {
  it('Bearer başlığı eksik isteğe TMDB 401 hatası verir', async () => {
    expect(await request('dövüş')).toMatchObject({ status: 401, json: { status_code: 7 } })
  })
  it('Türkçe kodlanmış sorguyu çözer ve Dövüş Kulübü filmini liste zarfında döndürür', async () => {
    expect((await request('dövüş', 'Bearer test-token'))?.json).toMatchObject({
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [{ id: 550, title: 'Dövüş Kulübü' }],
    })
  })
  it('başka sorgu için boş sonuç döndürür', async () => {
    expect((await request('bilinmeyen', 'Bearer test-token'))?.json).toMatchObject({
      results: [],
      total_results: 0,
    })
  })
})
