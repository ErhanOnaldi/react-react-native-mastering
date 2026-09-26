export type ThemeTokens = Record<string, string>

/** `oklch(0.55 0.18 40)` ya da `oklch(55% 0.18 40)` → 0.55 */
export function oklchLightness(value: string): number {
  return 0
}

/** Açıklık farkı `minGap`'ten küçük olan rol çiftlerinin adlarını döndürür (örn. ['primary']). */
export function findLowContrastPairs(tokens: ThemeTokens, minGap = 0.4): string[] {
  return []
}
