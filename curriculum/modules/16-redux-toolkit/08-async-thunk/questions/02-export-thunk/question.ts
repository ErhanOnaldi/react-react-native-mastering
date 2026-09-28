import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Dışa aktarma işlemi',
  difficulty: 'orta',
  concepts: ['redux.async-thunk', 'js.async-await'],
  files: ['exportList.ts'],
  hints: [
    'Girdi dizisi değişmeden kalmalı; sonucu hangi argümanla üreteceğini belirle.',
    'Payload creator aldığı `ids` değerinden yeni dizi üretmeli; spread bunu sağlar.',
    '`async (ids: number[]) => [...ids]` fulfilled payload’ı için yeterli.',
  ],
})
