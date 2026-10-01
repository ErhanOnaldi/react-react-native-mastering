import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İki adresin origin değerini karşılaştır',
  difficulty: 'kolay',
  concepts: ['web.cors', 'ts.functions'],
  files: ['sameOrigin.ts'],
  hints: [
    'Origin’i oluşturan üç alanı yan yana düşün: protokol, host ve port.',
    'Sonuç ancak üç alanın tamamı eşleştiğinde true olmalı; tek bir fark sonucu değiştirir.',
    'Her alanı eşleşen konumundaki alanla karşılaştır ve yalnızca hepsi eşitse true döndür.',
  ],
})
