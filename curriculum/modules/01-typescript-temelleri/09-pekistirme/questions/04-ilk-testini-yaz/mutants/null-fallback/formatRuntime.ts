export function formatRuntime(minutes: number | null): string {
  if (minutes === null || minutes <= 0) {
    return ''
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} dk`
  }
  if (remainingMinutes === 0) {
    return `${hours} sa`
  }
  return `${hours} sa ${remainingMinutes} dk`
}
