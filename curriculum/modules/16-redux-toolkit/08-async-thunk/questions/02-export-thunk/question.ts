import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Dışa aktarma işlemi',
  difficulty: 'orta',
  concepts: ['redux.async-thunk', 'js.async-await'],
  files: ['exportList.ts'],
  hints: [
    'Thunk’un payload creator’ına `ids` gelir.',
    'Yeni dizi için spread kullan.',
    '`async (ids: number[]) => [...ids]` yeterli.',
  ],
})
