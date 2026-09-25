import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Parametrenin tipi',
  difficulty: 'kolay',
  concepts: ['router.params', 'ts.narrowing'],
  question: '`/movie/550` için `const { id } = useParams()` sonucundaki `id` nasıl ele alınmalı?',
  options: [
    {
      text: '`string | undefined`; önce denetle, sonra sayıya çevir.',
      correct: true,
      explanation: 'Doğru. URL parçası metindir, başka rota altında bulunmayabilir.',
    },
    {
      text: 'Doğrudan `number`; rota `:id` yazıldığı için Router dönüştürür.',
      explanation: 'Dinamik parametreler otomatik sayıya dönüşmez.',
    },
    {
      text: '`as number` yazmak çalışma zamanında dönüştürür.',
      explanation: 'Type assertion yalnızca TypeScript’e söylenir, runtime değerini değiştirmez.',
    },
  ],
})
