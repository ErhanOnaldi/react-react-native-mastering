import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sorguya göre film döndüren handler',
  difficulty: 'orta',
  concepts: ['test.msw-overrides', 'test.factories', 'fetch.query-params'],
  files: ['searchHandler.ts'],
  hints: [
    'request.url değerinden URL oluştur.',
    'toLocaleLowerCase("tr") ile karşılaştır.',
    'Filtrelenen dizinin uzunluğunu total_results yap.',
  ],
})
