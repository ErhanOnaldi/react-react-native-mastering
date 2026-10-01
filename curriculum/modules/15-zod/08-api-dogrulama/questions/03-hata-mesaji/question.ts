import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Liste hatasının alanını belirt',
  difficulty: 'orta',
  concepts: ['zod.api-validation', 'zod.schemas'],
  files: ['errors.ts'],
  hints: [
    'Bozuk liste öğesinin hangi alanının sorunlu olduğunu bul; başarılı liste için hata metni üretme.',
    '`results` dizisini iç içe `z.object` ile doğrula; başlık için `.min(1)` ekle.',
    '`safeParse` sonucundaki ilk issue yolunu `join(".")` ile okunur metne ekle; başarıda null döndür.',
  ],
})
