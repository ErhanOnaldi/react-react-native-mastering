import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Boolean tuzağı',
  difficulty: 'kolay',
  concepts: ['zod.transform', 'router.search-params'],
  question: '`?archived=false` metnini boolean yapmak için hangi yaklaşım uygun?',
  options: [
    {
      text: '`z.stringbool()` metindeki false değerini false yapar.',
      correct: true,
      explanation: 'Doğru. Metin tabanlı boolean sözlüğünü kullanır.',
    },
    {
      text: '`z.coerce.boolean()` false yapar.',
      correct: false,
      explanation: 'Boolean("false") true’dur; coerce bunu izler.',
    },
    {
      text: '`Boolean(searchParams.get("archived"))` false yapar.',
      correct: false,
      explanation: 'Dolu string truthy olduğu için true döner.',
    },
  ],
})
