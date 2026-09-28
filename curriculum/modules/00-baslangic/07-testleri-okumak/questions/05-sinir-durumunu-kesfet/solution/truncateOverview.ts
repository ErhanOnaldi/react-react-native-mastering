export function truncateOverview(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  const sliced = text.slice(0, maxLength).trimEnd()
  if (sliced.endsWith('...')) {
    return sliced
  }

  return `${sliced}...`
}
