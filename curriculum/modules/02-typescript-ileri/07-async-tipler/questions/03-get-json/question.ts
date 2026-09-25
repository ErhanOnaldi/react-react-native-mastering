import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli isteğin sınırını gör',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.async-types', 'ts.api-types', 'fetch.headers-auth'],
  files: ['task.ts'],
  hints: [
    'fetch ikinci argümanda headers kabul eder.',
    'response.ok kontrolünü json okumadan önce yap.',
    '`(await response.json()) as T` yalnız tip iddiasıdır.',
  ],
})
