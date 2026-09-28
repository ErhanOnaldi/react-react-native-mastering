export type MovieSearchState =
  | { status: 'idle'; query: string; results: string[]; error: null }
  | { status: 'loading'; query: string; results: string[]; error: null }
  | { status: 'success'; query: string; results: string[]; error: null }
  | { status: 'error'; query: string; results: string[]; error: string }

export type MovieSearchAction =
  | { type: 'typed'; query: string }
  | { type: 'started' }
  | { type: 'succeeded'; results: string[] }
  | { type: 'failed'; error: string }

export const initialMovieSearchState: MovieSearchState = {
  status: 'idle',
  query: '',
  results: [],
  error: null,
}

export function movieSearchReducer(
  state: MovieSearchState,
  action: MovieSearchAction,
): MovieSearchState {
  switch (action.type) {
    case 'typed':
      return { status: 'idle', query: action.query, results: [], error: null }
    case 'started':
      return { ...state, status: 'loading', error: null }
    case 'succeeded':
      return { ...state, status: 'success', results: action.results, error: null }
    case 'failed':
      return { ...state, status: 'error', results: [], error: action.error }
    default: {
      const neverAction: never = action
      return neverAction
    }
  }
}
