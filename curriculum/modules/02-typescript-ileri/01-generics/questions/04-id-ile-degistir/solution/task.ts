export function replaceById<T extends { id: number }>(items: T[], next: T): T[] {
  return items.map((item) => (item.id === next.id ? next : item))
}
