import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Boolean tuzağı',
  difficulty: 'kolay',
  concepts: ['zod.transform', 'router.search-params'],
  question: `Aşağıdaki dönüşümlerin sonucunu eşleştir:

\`\`\`ts
Boolean('false')
z.coerce.boolean().parse('false')
z.stringbool().parse('false')
\`\`\`

Üçüncü satır da metni JavaScript truthiness kuralıyla mı yorumlar?`,
  options: [
    {
      text: 'İlk ikisi true, sonuncusu false olur; stringbool metinsel boolean değerini yorumlar.',
      correct: true,
      explanation:
        'Doğru. `Boolean` ve `z.coerce.boolean()` dolu stringi true sayar; `z.stringbool()` metin içeriğini okur.',
    },
    {
      text: 'İlk ve üçüncü false, ikinci true olur; coerce diğerlerinden bağımsız çalışır.',
      correct: false,
      explanation: 'Boolean("false") true’dur; coerce bunu izler.',
    },
    {
      text: 'Üçü de true olur; hepsi JavaScript Boolean dönüşümünü çağırır.',
      correct: false,
      explanation: 'Dolu string truthy olduğu için true döner.',
    },
  ],
})
