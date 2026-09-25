import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Üç bilet ekle',
  difficulty: 'kolay',
  concepts: ['react.state-snapshot', 'react.state'],
  files: ['TicketCounter.tsx'],
  hints: [
    'Aynı handler içindeki `count` neden üç satırda da aynı?',
    'Yeni değer eski değere bağlıysa `setCount` içine fonksiyon ver.',
    'Üç çağrının her birini `setCount(n => n + 1)` yap; iki tıklamada 6 gör.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
