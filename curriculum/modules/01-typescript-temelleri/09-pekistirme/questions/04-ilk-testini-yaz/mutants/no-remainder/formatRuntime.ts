export function formatRuntime(minutes: number | null): string {
  if (minutes === null || minutes <= 0) {
    return 'Süre bilinmiyor'
  }
  const hours = Math.floor(minutes / 60)
  if (hours === 0) {
    return `${minutes % 60} dk`
  }
  return `${hours} sa`
}
