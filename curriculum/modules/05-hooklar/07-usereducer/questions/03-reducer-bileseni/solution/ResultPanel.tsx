import { useReducer } from 'react'
type State = { status: 'idle' | 'loading' | 'success'; count: number }
type Action = { type: 'start' } | { type: 'done'; count: number }
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return { status: 'loading', count: 0 }
    case 'done':
      return { status: 'success', count: action.count }
  }
}
export function ResultPanel() {
  const [state, dispatch] = useReducer(reducer, { status: 'idle', count: 0 })
  return (
    <div>
      <button type="button" onClick={() => dispatch({ type: 'start' })}>
        Yükle
      </button>
      <button type="button" onClick={() => dispatch({ type: 'done', count: 3 })}>
        Tamamla
      </button>
      <p>
        {state.status === 'idle'
          ? 'Hazır'
          : state.status === 'loading'
            ? 'Yükleniyor'
            : `${state.count} film`}
      </p>
    </div>
  )
}
