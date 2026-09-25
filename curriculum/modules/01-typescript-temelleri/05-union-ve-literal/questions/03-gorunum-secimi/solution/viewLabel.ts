export type ViewMode = 'grid' | 'list'

export function viewLabel(mode: ViewMode): string {
  return mode === 'grid' ? 'Kartlar' : 'Liste'
}
