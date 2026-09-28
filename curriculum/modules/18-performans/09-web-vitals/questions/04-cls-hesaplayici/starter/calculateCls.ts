export interface LayoutShiftEntry {
  value: number
  hadRecentInput: boolean
  startTime?: number
}

export function calculateCls(entries: LayoutShiftEntry[]): number {
  return 0
}
