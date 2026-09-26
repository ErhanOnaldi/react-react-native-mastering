import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tür seçimi ve sayaç aynı anda değişsin',
  difficulty: 'orta',
  concepts: ['react.derived-state', 'react.controlled-input'],
  files: ['GenreCounter.tsx'],
  hints: [
    'Seçili türlerin listesi zaten mevcut. Sayı için ayrı bir bilgi kaynağı gerekiyor mu?',
    'Seçim dizisini immutable güncelle; sayı, o dizinin o render’daki uzunluğu olabilir.',
    'Checkbox `checked` değerlerini seçili id’lerden üret; temizleme boş diziye dönsün, sayaç da `selected.length` olsun.',
  ],
  preview: { entry: 'Preview.tsx' },
})
