export type Movie = { id: number; title: string }
export type MoviePromise = unknown
export type LoadedMovie = unknown
export async function loadMovie(): Promise<Movie> {
  return { id: 550, title: 'Dövüş Kulübü' }
}
export function movieLabel(movie: LoadedMovie): string {
  return ''
}
