export type GenreId = 18 | 53
export type GenreNames = Readonly<Record<GenreId, string>>
export const GENRE_NAMES: GenreNames = { 18: 'Dram', 53: 'Gerilim' }
export function genreLabel(id: GenreId): string { return '' }
