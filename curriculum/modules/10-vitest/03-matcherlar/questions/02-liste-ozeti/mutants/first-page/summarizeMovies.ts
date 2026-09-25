export interface MoviePage {
  page: number
  total_results: number
  results: { id: number; title: string }[]
}
export function summarizeMovies(data: MoviePage) {
  return {
    page: 1,
    total_pages: Math.max(1, Math.ceil(data.total_results / 20)),
    has_more: data.page * 20 < data.total_results,
  }
}
