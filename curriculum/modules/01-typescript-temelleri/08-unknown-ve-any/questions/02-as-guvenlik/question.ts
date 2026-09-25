import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'As ile güvenlik',
  difficulty: 'kolay',
  concepts: ['ts.unknown-any'],
  question: '`const movie = raw as Movie` neyi garanti eder?',
  options: [
    {
      text: 'Çalışma zamanında hiçbir alanı doğrulamaz.',
      correct: true,
      explanation: 'as yalnızca derleyiciye bir iddiadır; ağ verisini değiştirmez.',
    },
    { text: 'Eksik alanları otomatik doldurur.', explanation: 'Tip iddiası nesneyi dönüştürmez.' },
    {
      text: 'Null posteri stringe çevirir.',
      explanation: 'as, null değerin çalışma zamanı davranışını değiştirmez.',
    },
  ],
})
