export function safeExternalUrl(value: unknown, fallback = '#'): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  if (!trimmed) return fallback

  try {
    const parsed = new URL(trimmed)
    const allowed = ['https:', 'http:', 'mailto:']
    if (allowed.includes(parsed.protocol.toLowerCase())) {
      return trimmed
    }
    return fallback
  } catch {
    return fallback
  }
}
