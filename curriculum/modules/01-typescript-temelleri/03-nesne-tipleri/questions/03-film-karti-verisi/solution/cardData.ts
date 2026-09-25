export type CardMovie = { id: number; title: string; vote_average: number }

export function cardData(movie: CardMovie): { id: number; label: string } {
  return { id: movie.id, label: `${movie.title} (${movie.vote_average.toFixed(1)})` }
}
