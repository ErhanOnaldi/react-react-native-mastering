export type LocalizedMovie = { id: number; title: string }

const turkishCollator = new Intl.Collator('tr-TR')

export function sortAndFilterMovies(movies: LocalizedMovie[], query: string): LocalizedMovie[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR')

  return movies
    .filter((movie) => movie.title.toLocaleLowerCase('tr-TR').includes(normalizedQuery))
    .toSorted((left, right) => turkishCollator.compare(left.title, right.title))
}
