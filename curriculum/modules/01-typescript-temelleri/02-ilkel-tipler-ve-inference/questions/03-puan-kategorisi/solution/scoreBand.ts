export function scoreBand(vote: number): string {
  if (vote === 0) return 'oy yok'
  return vote >= 8 ? 'yüksek' : 'normal'
}
