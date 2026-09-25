import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Memo niçin yetmedi?',
  difficulty: 'kolay',
  concepts: ['perf.memo'],
  question:
    '`memo(MovieCard)` var ama parent her seferinde `onToggle={() => toggle(id)}` veriyor. Neden kart yine render olabilir?',
  options: [
    {
      text: 'Yeni callback referansı props eşitliğini bozar',
      correct: true,
      explanation: 'memo yüzeysel props karşılaştırır; yeni fonksiyon farklıdır.',
    },
    {
      text: 'memo yalnız class component’lerde çalışır',
      correct: false,
      explanation: 'Fonksiyon bileşenleri de memo ile sarılır.',
    },
    {
      text: 'useCallback her zaman gereklidir',
      correct: false,
      explanation: 'Yalnız ölçülmüş ihtiyaç veya referans sözleşmesi varsa fayda sağlar.',
    },
  ],
})
