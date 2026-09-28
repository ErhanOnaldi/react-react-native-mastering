export type CspDirectives = Record<string, string[] | undefined>

export function buildCsp(directives: CspDirectives): string {
  const parts: string[] = []

  for (const [directive, sources] of Object.entries(directives)) {
    if (!sources || sources.length === 0) continue
    const trimmedSources = sources.map((s) => s.trim()).filter(Boolean)
    if (trimmedSources.length > 0) {
      parts.push(`${directive} ${trimmedSources.join(' ')}`)
    }
  }

  return parts.join('; ')
}
