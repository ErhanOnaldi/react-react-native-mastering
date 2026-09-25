import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Son bakılanları sırala',
  difficulty: 'orta',
  concepts: ['redux.slice', 'react.immutability'],
  files: ['recent.ts'],
  hints: [
    'Önce aynı ID’yi çıkar.',
    '`filter`, sonra `unshift`, sonra `slice(0, 5)` uygula.',
    'Draft’ın `ids` alanına yeni diziyi atayabilirsin.',
  ],
})
