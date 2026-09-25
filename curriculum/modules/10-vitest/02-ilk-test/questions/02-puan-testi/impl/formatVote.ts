export function formatVote(voteAverage: number): string {
  if (voteAverage === 0) return 'Henüz oy yok'
  return voteAverage.toFixed(1)
}
