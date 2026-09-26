import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sıralama değişince favori kimde kalır?',
  difficulty: 'orta',
  concepts: ['react.state', 'react.immutability', 'react.lists-keys'],
  files: ['MovieShelf.tsx'],
  hints: [
    'Görünen sıra değişebilir; filmin kimliği değişmez. Favori bilgisini neye bağlamalısın?',
    'Sıralanmış görünümü kaynak diziyi değiştirmeden üret; favorileri film id’leriyle tut.',
    'Başlık için kopya diziyi `localeCompare(..., "tr")` ile sırala; `key` ve `aria-pressed` için sabit id kullan.',
  ],
  preview: { entry: 'Preview.tsx' },
})
