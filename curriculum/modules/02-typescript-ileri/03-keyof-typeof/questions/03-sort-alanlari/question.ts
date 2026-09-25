import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sıralama seçeneklerini diziden çıkar',
  difficulty: 'orta',
  concepts: ['ts.as-const', 'ts.keyof-typeof', 'ts.literal'],
  files: ['task.ts'],
  hints: [
    'as const olmadan eleman tipi string olur.',
    'Guard için readonly dizide `some` ile eşitlik karşılaştır.',
    'Her literal alan için Türkçe etiketi açıkça eşleştir.',
  ],
})
