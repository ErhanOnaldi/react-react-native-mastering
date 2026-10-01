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
  switch (action.type) {
    case 'query':
      return { ...state, query: action.value, page: 1, loading: false, results: [], error: null }
    case 'start':
      return { ...state, loading: true, error: null }
    case 'success':
      return { ...state, loading: false, results: action.results, error: null }
    case 'error':
      return { ...state, loading: false, error: action.message }
    case 'next':
      return { ...state, page: state.page + 1 }
    default:
      return state
  }
}
