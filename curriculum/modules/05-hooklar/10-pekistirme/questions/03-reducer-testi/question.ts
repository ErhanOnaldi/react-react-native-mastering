import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama reducer testlerini yaz',
  difficulty: 'orta',
  concepts: [
    'test.vitest-basics',
    'test.aaa',
    'test.matchers',
    'react.useReducer',
    'ts.discriminated-union',
  ],
  files: ['movieSearchReducer.test.ts'],
  hints: [
    'Her testte bir önceki state hazırla, tek action gönder ve dönen nesnenin tamamını karşılaştır.',
    '`@impl/movieSearchReducer` içinden reducer, başlangıç state’i ve gerekirse `MovieSearchState` tipini import et; `expect(...).toEqual(...)` kullan.',
    '`typed` için eski `results` dizisi dolu olan bir state kur; beklenen sonuçta `results: []` ve `error: null` yaz.',
    'Başarı testini özellikle önceki state `error` iken çalıştır; böylece başarıda eski hata mesajının temizlendiğini yakalarsın.',
  ],
  testWriting: {
    mutants: [
      { id: 'wrong-start', label: 'arama başlarken loading durumuna geçmeyen sürüm' },
      { id: 'keeps-old-results', label: 'yeni aramada eski sonuçları koruyan sürüm' },
      { id: 'keeps-error', label: 'başarıda eski hata mesajını temizlemeyen sürüm' },
    ],
  },
})
