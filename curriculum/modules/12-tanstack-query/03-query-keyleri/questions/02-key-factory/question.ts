import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film key factory',
  difficulty: 'orta',
  concepts: ['query.keys', 'ts.as-const', 'arch.colocation'],
  files: ['movieKeys.ts'],
  hints: [
    'Aynı sonucu etkileyen tüm değişkenleri key’e yaz.',
    'Arama için `query.trim()` ve `page`; detay için `id` kullan.',
    'Dizi sonuna parametreleri ekleyip `as const` ile döndür.',
  ],
})
