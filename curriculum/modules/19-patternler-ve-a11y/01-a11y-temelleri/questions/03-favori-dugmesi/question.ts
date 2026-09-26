import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Favori düğmesine anlam ver',
  difficulty: 'kolay',
  concepts: ['a11y.basics', 'react.props', 'test.rtl-queries'],
  files: ['FavoriteButton.tsx'],
  hints: [
    'Düğmenin rolü zaten doğru; eksik olan ad ve durum. Görünür metin yok, o halde adı nereden vereceksin?',
    'Adı `aria-label` ile sabit ver; favori durumunu ayrı bir ARIA özelliğiyle bildir. Yıldız da okunmasın.',
    '`aria-label="Favori"`, `aria-pressed={isFavorite}` ve yıldızı `<span aria-hidden="true">` içine al.',
  ],
  preview: { entry: 'Preview.tsx' },
})
