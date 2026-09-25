export interface Version {
  major: number
  minor: number
  patch: number
}

/** "19.3.0" → { major: 19, minor: 3, patch: 0 } */
export function parseVersion(text: string): Version {
  const [major = 0, minor = 0, patch = 0] = text.split('.').map(Number)
  return { major, minor, patch }
}

/** "^19.3.0" aralığı verilen sürümü kabul ediyor mu? */
export function satisfiesCaret(version: string, range: string): boolean {
  // Buraya yaz
  return false
}
