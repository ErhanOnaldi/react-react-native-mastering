export function formatRuntime(minutes: number | null): string {
  if (minutes === null || minutes <= 0) {
    return 'Süre bilinmiyor'
  }
  return `${minutes} dk`
}
