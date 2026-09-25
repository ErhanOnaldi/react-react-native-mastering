import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yeni film taslağı',
  difficulty: 'orta',
  concepts: ['ts.omit', 'ts.partial', 'js.spread'],
  files: ['task.ts'],
  hints: [
    'Omit içinde çıkarılacak anahtarları union ile yaz.',
    'Partial her taslak alanını opsiyonel yapar.',
    '`{ ...draft, ...patch }` verilmiş alanları günceller ve yeni nesne üretir.',
  ],
})
