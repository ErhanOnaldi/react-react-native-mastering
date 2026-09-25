export interface Movie {
  id: number
  title: string
  genre_ids: number[]
}
export function selectMovies(movies: Movie[], params: URLSearchParams, pageSize: number): Movie[] {
  const q = (params.get('q') ?? '').trim().toLocaleLowerCase('tr-TR')
  const rawGenre = params.get('genre')
  const parsedGenre = rawGenre && /^\d+$/.test(rawGenre) ? Number(rawGenre) : null
  const genre =
    parsedGenre !== null && Number.isSafeInteger(parsedGenre) && parsedGenre > 0
      ? parsedGenre
      : null
  const rawPage = Number(params.get('page') ?? '1')
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1
  return movies
    .filter(
      (movie) =>
        movie.title.toLocaleLowerCase('tr-TR').includes(q) &&
        (genre === null || movie.genre_ids.includes(genre)),
    )
    .slice((page - 1) * pageSize, page * pageSize)
}
