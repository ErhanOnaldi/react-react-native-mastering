import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sıralanan notlar',
  difficulty: 'kolay',
  concepts: ['react.lists-keys', 'react.immutability', 'js.spread'],
  files: ['SortableNotes.tsx'],
  hints: [
    'Input değeri hangi filmle birlikte yaşamalı: satırın konumuyla mı, filmin kimliğiyle mi?',
    'React reconciliation için kararlı key, ters sıra için de kaynağı değiştirmeyen yeni dizi gerekir.',
    'Görünümü `reversed ? [...movies].reverse() : movies` ile üret; her satıra `key={movie.id}` ver.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
