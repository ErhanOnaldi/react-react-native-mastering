export type Locale = 'tr' | 'en'

export type Message = { key: 'movieCount'; count: number } | { key: 'welcome'; name: string }

export function t(message: Message, locale: Locale): string {
  if (message.key === 'movieCount') {
    const noun = locale === 'en' && message.count !== 1 ? 'movies' : 'movie'
    const turkishNoun = 'film'
    return `${message.count} ${locale === 'tr' ? turkishNoun : noun}`
  }

  return locale === 'tr' ? `Merhaba, ${message.name}` : `Welcome, ${message.name}`
}
