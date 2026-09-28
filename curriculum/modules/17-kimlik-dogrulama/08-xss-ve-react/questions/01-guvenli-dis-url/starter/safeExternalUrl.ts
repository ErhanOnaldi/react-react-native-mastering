export function safeExternalUrl(value: unknown, fallback = '#'): string {
  return typeof value === 'string' ? value : fallback
}
