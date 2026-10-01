import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Memo context değişimini durdurur mu?',
  difficulty: 'orta',
  concepts: ['perf.rerender'],
  question: `\`ThemeBadge\` bileşeni \`memo\` ile sarılmış ve \`useContext(ThemeContext)\` ile tema rengini okuyor. Provider'ın tema değeri değişince ne olur?`,
  options: [
    {
      text: 'ThemeBadge yeniden çalışır; memo, bileşenin okuduğu Context değerindeki değişimi engellemez.',
      correct: true,
      explanation:
        'Bileşen kendi okuduğu Context değerine abonedir. Değer değiştiğinde yeni temayı gösterebilmesi için render edilir.',
    },
    {
      text: 'ThemeBadge yalnız parent props değişirse yeniden çalışır.',
      correct: false,
      explanation:
        'Context, parent props dışında bir render nedenidir; tüketen bileşen yeni Context değerini almalıdır.',
    },
    {
      text: 'memo Context değerini eski renkte tutar; tema değişimi bileşene ulaşmaz.',
      correct: false,
      explanation:
        'memo parent props karşılaştırmasını etkiler; bileşenin kendi Context aboneliğini kapatmaz.',
    },
  ],
})
