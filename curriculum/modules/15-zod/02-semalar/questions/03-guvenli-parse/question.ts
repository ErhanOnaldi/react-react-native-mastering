import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Güvenli kart başlığı',
  difficulty: 'orta',
  concepts: ['zod.schemas', 'react.conditional-rendering'],
  files: ['label.ts'],
  hints: [
    'Kartın bozuk veri geldiğinde ne göstermesi gerektiğinden başla.',
    'Başlık şemasında `.min(1)` kullan; `safeParse(raw)` sonucunun `success` alanını kontrol et.',
    'Başarıda `result.data.title`, başarısızlıkta `Film verisi geçersiz` döndür.',
  ],
})
