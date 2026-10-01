export type RatingLevel = 'low' | 'mid' | 'high'
export type Badge = { label: string; color: string }

export const RATING_BADGES: Readonly<Record<RatingLevel, Badge>> = {
  low: { label: 'Zayıf', color: 'red' },
  mid: { label: 'İdare eder', color: 'amber' },
  high: { label: 'Çok iyi', color: 'green' },
}

export function ratingLevel(vote: number): RatingLevel {
  if (vote < 5) return 'low'
  if (vote < 7.5) return 'mid'
  return 'high'
}

export function badgeFor(vote: number): Badge {
  return RATING_BADGES[ratingLevel(vote)]
}
