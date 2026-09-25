export type State = {
  query: string
  page: number
  loading: boolean
  results: string[]
  error: string | null
}
export type Action =
  | { type: 'query'; value: string }
  | { type: 'start' }
  | { type: 'success'; results: string[] }
  | { type: 'error'; message: string }
  | { type: 'next' }
export const initialState: State = { query: '', page: 1, loading: false, results: [], error: null }
export function searchReducer(state: State, action: Action): State {
  return state
}
