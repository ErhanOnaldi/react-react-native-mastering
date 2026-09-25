export function formatVote(voteAverage: number): string {
  if (voteAverage === 0) return 'Henüz oy yok'
  return String(Math.round(voteAverage * 10) / 10)
}
