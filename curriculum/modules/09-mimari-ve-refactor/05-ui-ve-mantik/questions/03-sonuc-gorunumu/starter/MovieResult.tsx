export type ResultState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; movies: { id: number; title: string }[] }

export function MovieResult({ state }: { state: ResultState }) {
  return <div />
}
