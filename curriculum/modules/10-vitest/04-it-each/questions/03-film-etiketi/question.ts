import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film kartı etiketini tabloyla test et',
  difficulty: 'orta',
  concepts: ['test.each', 'js.string-formatting', 'ts.object-types'],
  files: ['movieLabel.test.ts'],
  hints: [
    'Aynı etiket kuralını dolu tarih, boş tarih ve kenar boşluklu başlıkla ayrı satırlarda denetle.',
    'Her satırda aynı fonksiyon ve aynı string matcher’ı kullanılmalı.',
    '`it.each` tablosunda her satıra film girdisi ve beklenen etiketi koy.',
    'Boş tarihli satır `Yeni Film` beklemeli; başlık girdisi ` Matrix ` olan satır `Matrix (1999)` beklemeli.',
  ],
  testWriting: {
    mutants: [
      { id: 'keeps-spaces', label: 'başlık kenarlarındaki boşlukları koruyan sürüm' },
      { id: 'empty-year', label: 'tarih boşken parantezleri de gösteren sürüm' },
    ],
  },
})
