import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'sum fonksiyonu',
  difficulty: 'kolay',
  concepts: ['mini.sum'],
  files: ['sum.ts'],
  hints: ['`+` operatörünü kullan.'],
  rubric: ['Fonksiyon saf mı?'],
})
