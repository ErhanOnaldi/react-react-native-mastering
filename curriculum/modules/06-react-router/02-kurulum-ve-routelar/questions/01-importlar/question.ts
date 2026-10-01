import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi ekran açılır?',
  difficulty: 'kolay',
  concepts: ['router.setup', 'js.modules'],
  question: `Bu route ağacıyla \`/search\` adresi açıldığında ne olur?

\`\`\`tsx
const routes = [
  { path: '/', element: <h1>Sinema</h1> },
  { path: '/search', element: <h1>Film ara</h1> },
]
\`\`\``,
  options: [
    {
      text: '`Film ara` başlığı gösterilir.',
      correct: true,
      explanation: 'Adres `/search` ile ikinci route eşleşir; onun element’i ekrana gelir.',
    },
    {
      text: '`Sinema` başlığı gösterilir; ilk route her zaman seçilir.',
      explanation:
        'Router route dizisinin ilk elemanını sabit seçmez; geçerli adresle eşleşeni bulur.',
    },
    {
      text: 'İki başlık da gösterilir; her `path` eşleşmesi birlikte render edilir.',
      explanation:
        'Birbirinin kardeşi olan bu iki route aynı anda eşleşmez; `/search` ikinci içeriği seçer.',
    },
  ],
})
