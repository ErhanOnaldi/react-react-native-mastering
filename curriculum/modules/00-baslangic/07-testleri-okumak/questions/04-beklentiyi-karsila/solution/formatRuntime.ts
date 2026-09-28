export function formatRuntime(minutes: number): string {
  if (minutes <= 0) {
    return '0 dk'
  }

  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60

  if (hours === 0) {
    return `${remaining} dk`
  }

  if (remaining === 0) {
    return `${hours} sa`
  }

  return `${hours} sa ${remaining} dk`
}
