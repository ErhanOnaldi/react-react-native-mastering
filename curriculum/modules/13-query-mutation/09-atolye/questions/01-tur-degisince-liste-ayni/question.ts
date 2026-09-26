import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tür değişince liste aynı',
  difficulty: 'orta',
  concepts: ['query.keys', 'test.msw', 'fetch.query-params'],
  files: ['GenreDiscover.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Seçilen türün istek ve saklanan sonuçla ilişkisini izle.',
    'Aksiyon ve komedi farklı sunucu sonuçlarıdır; sorgu kimliği ve istek parametresi aynı seçimi anlatmalı.',
    'Türü queryKey’e ve with_genres parametresine ekle; görünümü geçerli sorgunun cevabından besle.',
  ],
})
