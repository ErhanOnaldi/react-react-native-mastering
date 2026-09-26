/** TMDB'de 0 henüz puan verilmediği anlamına gelir. */
export function formatVote(n: number): string {
  if (n === 0) return 'Henüz oy yok'
  return n.toFixed(1)
}

/** ISO tarih metnindeki yılı alır; boş tarihi boş bırakır. */
export function releaseYear(date: string): string {
  if (date === '') return ''
  return date.slice(0, 4)
}

/** Tarihi kullanıcıya Türkçe uzun biçimde gösterir. */
export function formatDate(date: string): string {
  if (date === '') return 'Tarih yok'
  const parsed = new Date(`${date}T00:00:00Z`)
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}
