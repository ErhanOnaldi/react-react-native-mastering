export interface LayoutShiftEntry {
  value: number
  hadRecentInput: boolean
  startTime?: number
}

export function calculateCls(entries: LayoutShiftEntry[]): number {
  const sum = entries
    .filter((entry) => !entry.hadRecentInput)
    .reduce((total, entry) => total + entry.value, 0)

  return Math.round(sum * 10000) / 10000
}
