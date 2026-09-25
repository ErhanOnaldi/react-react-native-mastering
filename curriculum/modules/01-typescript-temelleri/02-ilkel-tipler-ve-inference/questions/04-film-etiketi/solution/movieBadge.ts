export function movieBadge(vote: number, adult: boolean): string {
  const audience = adult ? '18+' : 'Genel'
  return `${audience} · ${vote.toFixed(1)}`
}
