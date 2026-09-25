import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Boş alanları normalize et',
  difficulty: 'orta',
  concepts: ['ts.narrowing', 'ts.optional-nullable', 'js.string-formatting'],
  files: ['normalizeMovie.ts'],
  hints: [
    'Kaynak alanları yeni nesneye tek tek taşı.',
    'Boş tarih için yıl fallback’i, boş poster için null kullan.',
    'Dolu tarihte `.slice(0, 4)`; dolu posterde orijinal yolu kullan.',
  ],
})
