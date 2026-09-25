import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'greet fonksiyonu',
  difficulty: 'kolay',
  concepts: ['mini.sum'],
  project: 'mini',
  focusFiles: ['src/greet.ts'],
  reviewFiles: ['src/**/*.ts'],
  rubric: ['Fonksiyon isimlendirmesi açık mı?'],
})
