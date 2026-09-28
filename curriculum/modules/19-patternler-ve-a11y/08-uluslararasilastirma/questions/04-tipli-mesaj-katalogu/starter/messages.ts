export type Locale = 'tr' | 'en'

export function t(
  _key: 'movieCount' | 'welcome',
  _params: { count: number } | { name: string },
  _locale: Locale,
): string {
  return ''
}
