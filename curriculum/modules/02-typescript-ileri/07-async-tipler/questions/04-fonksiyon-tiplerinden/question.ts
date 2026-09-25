import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Fonksiyon imzasını yeniden yazma',
  difficulty: 'orta',
  concepts: ['ts.return-parameters', 'ts.async-types', 'ts.generics'],
  files: ['task.ts'],
  hints: [
    'Parameters parametreleri tuple olarak verir.',
    'ReturnType Promise’i, Awaited içindeki veriyi verir.',
    'args[0] ID değeridir.',
  ],
})
