export function safeTitle(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('title' in value)) return 'Başlık yok'
  return typeof value.title === 'string' ? value.title : 'Başlık yok'
}
