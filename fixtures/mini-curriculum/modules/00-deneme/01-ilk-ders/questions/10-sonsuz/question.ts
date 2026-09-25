import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sonsuz döngü',
  difficulty: 'kolay',
  concepts: ['mini.sum'],
  files: ['loop.ts'],
  timeoutMs: 8000,
})
