export type Movie = { id: number; title: string }
export type MoviePromise = Promise<Movie>
export type LoadedMovie = Awaited<MoviePromise>
export async function loadMovie(): MoviePromise {
  return { id: 550, title: 'Dövüş Kulübü' }
}
export function movieLabel(movie: LoadedMovie): string {
  return `${movie.title} (#${movie.id})`
}
