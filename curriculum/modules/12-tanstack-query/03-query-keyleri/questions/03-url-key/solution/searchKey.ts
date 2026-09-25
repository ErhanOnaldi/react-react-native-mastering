export function searchKey(params: URLSearchParams) {
  const query = params.get('q')?.trim() ?? ''
  const raw = Number(params.get('page') ?? '1')
  const page = Number.isInteger(raw) && raw > 0 ? raw : 1
  return ['movies', 'search', query, page] as const
}
