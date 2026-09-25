import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hata hangi alanda?',
  difficulty: 'kolay',
  concepts: ['zod.refine', 'form.rhf-errors'],
  question:
    'Spoiler işaretli yorumun metni boşsa hata RHF’de `body` alanında görünsün. Hangisi gerekir?',
  options: [
    {
      text: 'Nesne refine kuralında `path: ["body"]` veririm.',
      correct: true,
      explanation: 'Doğru. Path alan bazlı hata gösterimini belirler.',
    },
    {
      text: 'Sadece `error` metni yeterlidir.',
      correct: false,
      explanation: 'Mesaj tek başına hatanın hangi alana ait olduğunu söylemez.',
    },
    {
      text: '`z.infer` hatanın yolunu ayarlar.',
      correct: false,
      explanation: 'Tip çıkarımı doğrulama hata yolunu etkilemez.',
    },
  ],
})
