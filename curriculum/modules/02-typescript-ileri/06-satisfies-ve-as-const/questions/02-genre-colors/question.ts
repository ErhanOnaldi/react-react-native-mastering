import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tür renkleri config’i',
  difficulty: 'orta',
  concepts: ['ts.satisfies', 'ts.as-const', 'ts.record'],
  files: ['task.ts'],
  hints: [
    'Tür kimliği listesini tek kaynak yap; tipi ikinci kez elle yazma.',
    '`as const` ile tuple elemanlarını koru, `satisfies Record<...>` ile tabloları denetle.',
    'Fonksiyonlar seçilen anahtarla tabloyu indeksleyip ilgili literal değeri döndürebilir.',
  ],
})
