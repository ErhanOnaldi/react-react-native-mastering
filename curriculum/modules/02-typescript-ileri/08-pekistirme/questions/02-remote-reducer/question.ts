import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Uzak veri geçişleri',
  difficulty: 'zor',
  concepts: ['ts.discriminated-union', 'ts.generics', 'ts.exhaustive-check', 'js.spread'],
  files: ['task.ts'],
  hints: [
    'action.type üzerinden switch kullan.',
    'Her dalda yalnız o duruma ait alanları olan yeni nesne döndür.',
    'default dalında `const exhaustive: never = action` yaz.',
  ],
})
