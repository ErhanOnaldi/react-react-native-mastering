import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'ID kısıtlı arama',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.generic-constraints', 'js.array-methods'],
  files: ['task.ts'],
  hints: [
    'Fonksiyonun okuyacağı en küçük ortak alanı düşün: her öğede sayısal `id` var.',
    '`T extends { id: number }` kısıtıyla bu özelliği bildir; listeyi `readonly T[]` kabul et.',
    '`find` sonucu doğrudan `T | undefined` dönebilir.',
    'Eşleşen nesneyi yeniden kurma; böylece ek alanların tipi korunur.',
  ],
})
