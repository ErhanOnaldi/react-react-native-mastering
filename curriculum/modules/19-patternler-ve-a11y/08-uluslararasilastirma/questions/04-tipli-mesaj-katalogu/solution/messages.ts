export type Locale = 'tr' | 'en'

const messages = {
  tr: {
    movieCount: (params: { count: number }) => `${params.count} film`,
    welcome: (params: { name: string }) => `Merhaba, ${params.name}`,
  },
  en: {
    movieCount: (params: { count: number }) => {
      const category = new Intl.PluralRules('en').select(params.count)
      return `${params.count} ${category === 'one' ? 'movie' : 'movies'}`
    },
    welcome: (params: { name: string }) => `Welcome, ${params.name}`,
  },
} as const

type MessageKey = keyof typeof messages.tr
type MessageParams<K extends MessageKey> = Parameters<(typeof messages.tr)[K]>[0]

export function t<K extends MessageKey>(key: K, params: MessageParams<K>, locale: Locale): string {
  const formatMessage = messages[locale][key] as (value: MessageParams<K>) => string
  return formatMessage(params)
}
