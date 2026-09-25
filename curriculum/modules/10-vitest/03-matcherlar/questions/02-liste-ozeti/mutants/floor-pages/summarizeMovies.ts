export interface MoviePage {
  page: number
  total_results: number
  results: { id: number; title: string }[]
}
export function summarizeMovies(data: MoviePage) {
  return {
    page: data.page,
    total_pages: Math.max(1, Math.floor(data.total_results / 20)),
    has_more: data.page * 20 < data.total_results,
  }
}
