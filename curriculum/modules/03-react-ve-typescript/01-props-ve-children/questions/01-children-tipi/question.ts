import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çocuk içerik',
  difficulty: 'kolay',
  concepts: ['react.children'],
  question: `Poster çerçevesine bazen yazı, bazen \`<strong>Matrix</strong>\` verilecek. \`children\` prop'u ikisini de kabul etmeli. Hangi tip uygundur?`,
  options: [
    {
      text: '`ReactNode`',
      correct: true,
      explanation: 'ReactNode hem metin hem de gösterilebilir JSX içeriğini kapsar.',
    },
    {
      text: '`string`',
      explanation: 'string yazıyı kabul eder ama JSX elementi kabul etmez.',
    },
    {
      text: '`ReactElement`',
      explanation: 'ReactElement JSX elementi içindir; düz metin children da kabul edilmelidir.',
    },
    {
      text: '`Movie`',
      explanation: 'Movie veri nesnesidir; doğrudan gösterilebilir çocuk içeriğin tipi değildir.',
    },
  ],
})
