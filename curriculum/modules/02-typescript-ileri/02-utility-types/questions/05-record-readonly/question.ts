import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tür adlarını güvenli tut',
  difficulty: 'orta',
  concepts: ['ts.record', 'ts.readonly', 'ts.keyof-typeof'],
  files: ['task.ts'],
  hints: [
    'Kapalı kimlik kümesindeki tüm türler için bir etiket gerektiğini düşün.',
    '`Record<GenreId, string>` tüm kimliklere değer ister; `Readonly` yeniden atamayı engeller.',
    '`GENRE_NAMES[id]` seçilen adı verir; iki kimliğin Türkçe değerlerini açıkça tanımla.',
  ],
})
