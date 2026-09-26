export type ThemeTokens = Record<string, string>

/** `oklch(0.55 0.18 40)` ya da `oklch(55% 0.18 40)` → 0.55 */
export function oklchLightness(value: string): number {
  const match = /^oklch\(\s*([\d.]+)(%?)/.exec(value.trim())
  if (!match) throw new Error(`OKLCH değeri okunamadı: ${value}`)
  const lightness = Number(match[1])
  return match[2] === '%' ? lightness / 100 : lightness
}

/** Açıklık farkı `minGap`'ten küçük olan rol çiftlerinin adlarını döndürür (örn. ['primary']). */
export function findLowContrastPairs(tokens: ThemeTokens, minGap = 0.4): string[] {
  const weak: string[] = []
  for (const [name, foreground] of Object.entries(tokens)) {
    if (!name.endsWith('foreground')) continue
    // --card-foreground → --card; --foreground → --background (sayfanın kendisi)
    const role = name === '--foreground' ? 'background' : name.slice(2, -'-foreground'.length)
    const surface = tokens[`--${role}`]
    if (surface === undefined) continue
    const gap = Math.abs(oklchLightness(surface) - oklchLightness(foreground))
    if (gap < minGap) weak.push(role)
  }
  return weak
}
