import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Listeyi başlığa dönüştür',
  difficulty: 'kolay',
  concepts: ['ts.arrays-tuples', 'js.array-methods'],
  files: ['movieTitles.ts'],
  hints: [
    'Önce `filter` ile null posterleri ayır.',
    'Sonra `map` ile başlığa dönüştür.',
    'İki dizi metodunu art arda bağla.',
  ],
})
