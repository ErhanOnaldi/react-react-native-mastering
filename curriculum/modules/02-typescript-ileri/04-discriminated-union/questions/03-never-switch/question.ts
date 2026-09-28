import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yeni durum unutulmasın',
  difficulty: 'orta',
  concepts: ['ts.exhaustive-check', 'ts.discriminated-union', 'ts.narrowing'],
  files: ['task.ts'],
  hints: [
    'Her status değerinde hangi metnin üretileceğini önce sırala.',
    '`switch (state.status)` ile daralt; success dalında `show(state.data)` çağır.',
    '`default` dalında `const exhaustive: never = state` ile yeni durumları yakala.',
  ],
})
