import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'cva ile filtre varyantları',
  difficulty: 'orta',
  concepts: ['tailwind.cva', 'ts.union'],
  files: ['filterVariants.ts'],
  hints: [
    'İki karar ekseni var: tone ve size.',
    'cva variants tablosuna tüm seçenekleri, sonra defaultVariants değerlerini ekle.',
    '`compoundVariants: [{ tone: "selected", size: "sm", class: "font-bold" }]` yalnız birleşik durumda çalışır.',
  ],
})
