import { useSuspenseQuery } from '@tanstack/react-query'
import { Component, Suspense } from 'react'
import type { ReactNode } from 'react'
type Movie = { id: number; title: string }
type Props = { id: number; load: (id: number) => Promise<Movie> }
class DetailErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return <p role="alert">Film yüklenemedi</p>
    return this.props.children
  }
}
function DetailContent({ id, load }: Props) {
  const { data } = useSuspenseQuery({ queryKey: ['movie', id], queryFn: () => load(id) })
  return <h1>{data.title}</h1>
}
export function MovieDetail(props: Props) {
  return (
    <DetailErrorBoundary>
      <Suspense fallback={<p>Film yükleniyor…</p>}>
        <DetailContent {...props} />
      </Suspense>
    </DetailErrorBoundary>
  )
}
