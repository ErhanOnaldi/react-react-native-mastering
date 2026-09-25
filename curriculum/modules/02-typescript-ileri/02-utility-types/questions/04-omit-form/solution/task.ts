export type Movie = { id: number; title: string; poster_path: string | null; overview: string; vote_average: number; vote_count: number }
export type MovieDraft = Omit<Movie, 'id' | 'vote_average' | 'vote_count'>
export type MovieDraftPatch = Partial<MovieDraft>
export function applyDraftPatch(draft: MovieDraft, patch: MovieDraftPatch): MovieDraft {
  return { ...draft, ...patch }
}
