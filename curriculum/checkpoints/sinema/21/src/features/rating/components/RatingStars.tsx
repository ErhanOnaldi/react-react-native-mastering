interface RatingStarsProps {
  movieId: number
  value: number | null
  onRate: (value: number) => void
  pending?: boolean
  error?: string
}

export function RatingStars({
  movieId,
  value,
  onRate,
  pending = false,
  error,
}: RatingStarsProps) {
  return (
    <div className="space-y-2">
      <p id={`rating-label-${movieId}`} className="font-medium">
        Puanın:{' '}
        {value === null ? 'Henüz puanlamadın' : value.toLocaleString('tr-TR')}
      </p>
      <div
        role="group"
        aria-labelledby={`rating-label-${movieId}`}
        className="flex flex-wrap gap-1"
      >
        {Array.from({ length: 20 }, (_, index) => (index + 1) / 2).map(
          (score) => (
            <button
              key={score}
              type="button"
              disabled={pending}
              aria-label={`${score.toLocaleString('tr-TR')} puan`}
              aria-pressed={value === score}
              onClick={() => onRate(score)}
              className="rounded border border-slate-500 px-2 py-1 text-sm hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {score.toLocaleString('tr-TR')}
            </button>
          ),
        )}
      </div>
      {pending && <p role="status">Puan kaydediliyor…</p>}
      {error && <p role="alert">Puan kaydedilemedi: {error}</p>}
    </div>
  )
}
