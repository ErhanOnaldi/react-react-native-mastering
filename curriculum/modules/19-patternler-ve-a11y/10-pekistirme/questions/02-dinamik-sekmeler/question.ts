import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eksik fragmanda sekme akışı',
  difficulty: 'orta',
  concepts: [
    'a11y.keyboard',
    'a11y.focus',
    'react.derived-state',
    'react.conditional-rendering',
    'react.lists-keys',
  ],
  files: ['MovieSections.tsx'],
  hints: [
    'Sekme sayısı girdiye bağlı. Liste, seçili durum ve panel içeriği aynı görünen seçeneklerden türemeli.',
    'Koşullu render, DOM sırası, klavye event’i ve render sırasında türetilen state ilkelerini kullan.',
    'Video yoksa sekme listesinden çıkar. Seçili değer listede kalmıyorsa Özet’i etkin değer olarak hesapla; kaldırılan sekme focus’taysa focus’u Özet’e taşı.',
  ],
  preview: { entry: 'Preview.tsx' },
})
