export function yearLabel(date: string): string {
  if (date === '') return 'Tarih yok'
  return date.slice(0, 4)
}
