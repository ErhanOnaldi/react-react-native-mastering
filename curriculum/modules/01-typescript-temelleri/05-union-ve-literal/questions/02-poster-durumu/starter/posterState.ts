export type PosterState = 'missing' | 'ready'

export function posterState(path: string | null): PosterState {
  return 'ready'
}
