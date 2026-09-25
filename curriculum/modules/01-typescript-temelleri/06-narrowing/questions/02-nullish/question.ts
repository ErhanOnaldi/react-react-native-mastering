import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Nullish varsayılan',
  difficulty: 'kolay',
  concepts: ['js.optional-chaining'],
  question: '`const label = date ?? "Tarih yok"` ifadesinde `date` boş string ise sonuç nedir?',
  options: [
    {
      text: 'Boş string kalır.',
      correct: true,
      explanation: '?? yalnızca null veya undefined için sağ tarafı seçer.',
    },
    { text: '`"Tarih yok"` olur.', explanation: 'Bu `||` davranışıdır; ?? boş string’i korur.' },
    {
      text: 'TypeScript derleme hatası verir.',
      explanation: 'Boş string geçerli bir string değeridir.',
    },
  ],
})
