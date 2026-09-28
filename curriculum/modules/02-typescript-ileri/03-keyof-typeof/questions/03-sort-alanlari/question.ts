import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sıralama seçeneklerini diziden çıkar',
  difficulty: 'orta',
  concepts: ['ts.as-const', 'ts.keyof-typeof', 'ts.literal'],
  files: ['task.ts'],
  hints: [
    'İzinli alanların tek kaynağını bir sabit tuple olarak kur.',
    '`as const` ve `(typeof SORT_FIELDS)[number]` literal unionı korur; `some` runtime guard için uygundur.',
    'Guard ile üyeliği doğrula, sonra her alan için Türkçe etiketi döndür.',
  ],
})
