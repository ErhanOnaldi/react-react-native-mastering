export function getSafeRedirect(value: unknown, fallback = '/profile'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || /[\u0000-\u001f\u007f]/.test(value)) return fallback
  return value
}
