import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hata hangi alanda?',
  difficulty: 'kolay',
  concepts: ['zod.refine', 'form.rhf-errors'],
  question: `Bir şema nesnesinin tamamını denetliyor. Bu nesne için kural başarısız olduğunda hata \`body\` alanıyla ilişkilensin istiyorsun:

\`\`\`ts
const reviewSchema = z.object({ body: z.string(), hasSpoiler: z.boolean() })
  .refine((value) => !value.hasSpoiler || value.body.length >= 10, ???)
\`\`\`

Eksik seçenek ne olmalı?`,
  options: [
    {
      text: "İkinci argümana `{ path: ['body'], error: 'Açıklama kısa' }` veririm.",
      correct: true,
      explanation:
        'Doğru. `path` issue kaydını body alanıyla ilişkilendirir; `error` ise okunur mesajı verir.',
    },
    {
      text: 'Yalnızca `{ error: "Açıklama kısa" }` veririm; alan yolu kendiliğinden çıkarılır.',
      correct: false,
      explanation: 'Mesaj tek başına hatanın hangi alana ait olduğunu söylemez.',
    },
    {
      text: '`z.infer` ile body alanını ayrı tipe dönüştürürüm; Zod bu tipi kullanıp yolu bulur.',
      correct: false,
      explanation: 'Tip çıkarımı doğrulama hata yolunu etkilemez.',
    },
  ],
})
