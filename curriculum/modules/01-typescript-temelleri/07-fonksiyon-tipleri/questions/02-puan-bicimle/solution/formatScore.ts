export function formatScore(vote: number, digits = 1): string {
  if (vote === 0) return 'Henüz oy yok'
  return vote.toFixed(digits)
}
