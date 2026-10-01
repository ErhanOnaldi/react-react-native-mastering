import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Lazy route ne zaman yüklenir?',
  difficulty: 'orta',
  concepts: ['router.lazy', 'js.modules'],
  question: `Bu route ağacıyla kullanıcı \`/\` adresini açıyor, sonra \`/favorites\` bağlantısını seçiyor. Hangi sırayla çalışır?

\`\`\`tsx
[
  { path: '/', element: <h1>Sinema</h1> },
  { path: '/favorites', lazy: () => import('./favorites') },
]
\`\`\``,
  options: [
    {
      text: 'Önce `/favorites` eşleşir, sonra modül import edilir ve route bileşeni gösterilir.',
      correct: true,
      explanation:
        'Path route ağacında hazırdır. Eşleşen route seçildikten sonra Router lazy modüldeki route alanlarını alır.',
    },
    {
      text: 'Önce modül import edilir; Router ancak sonra adresin eşleşip eşleşmediğini bulur.',
      explanation:
        'Router adresi hangi route ile eşleştireceğini önceden bilmelidir; lazy modül eşleşme yolunun yerine geçmez.',
    },
    {
      text: 'İlk `/` açılışında iki route’un bileşen kodu da birlikte import edilir.',
      explanation:
        'Lazy route modülünün amacı içeriğini o route gerektiğinde yüklemektir; başlangıç route’u için hemen yüklemek değildir.',
    },
  ],
})
