import { delay, http, HttpResponse } from 'msw'
export function makeEmptySearchHandler(waitMs: number) {
  return http.get('https://api.themoviedb.org/3/search/movie', async ({ request }) => {
    await delay(waitMs)
    const page = Number(new URL(request.url).searchParams.get('page') ?? '1')
    if (!Number.isInteger(page) || page < 1)
      return HttpResponse.json({ status_code: 22 }, { status: 400 })
    return HttpResponse.json({ page, results: [], total_pages: 1, total_results: 0 })
  })
}
