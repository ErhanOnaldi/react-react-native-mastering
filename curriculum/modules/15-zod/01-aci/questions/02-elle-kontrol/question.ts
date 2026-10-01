import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kontrol nerede büyür?',
  difficulty: 'kolay',
  concepts: ['ts.unknown-any', 'ts.type-guards'],
  question: `Yalnızca dış nesnenin object olup olmadığını kontrol eden bu kodda hangi değer güvenlidir?

\`\`\`ts
if (typeof raw === 'object' && raw !== null) {
  return (raw as { credits: { cast: { name: string }[] } }).credits.cast
    .map((person) => person.name.toUpperCase())
}
\`\`\`

Yanıtın \`credits.cast\` alanı eksik veya içindeki ilk \`name\` null olabilir.`,
  options: [
    {
      text: 'Yalnızca dış nesnenin varlığı bilinir; iç içe alanlara erişmeden önce onları da doğrulamalısın.',
      correct: true,
      explanation:
        'Doğru. Dış nesne kontrolü credits, cast dizisi veya name alanının şeklini kanıtlamaz; cast alanlarına erişim yine hata verebilir.',
    },
    {
      text: 'Dış nesnenin object olması credits alanının nesne olduğunu da kanıtlar.',
      correct: false,
      explanation: 'Bir nesne alanları eksik ya da yanlış tipte olabilir.',
    },
    {
      text: '`as` ifadesindeki MovieDetails tipi alt nesneleri çalışma anında kontrol eder.',
      correct: false,
      explanation: 'Type assertion derlemeden sonra silinir; veri aynı kalır.',
    },
  ],
})
