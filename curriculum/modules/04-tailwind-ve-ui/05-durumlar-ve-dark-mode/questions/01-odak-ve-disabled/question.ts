import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Odak ile görünümü ayır',
  difficulty: 'kolay',
  concepts: ['tailwind.states', 'a11y.basics'],
  question:
    'Bu düğmede bir `.dark` atası varken hangi class koyu tema zemin rengini seçer? `className="bg-sky-700 hover:bg-sky-800 dark:bg-sky-500"`',
  options: [
    {
      text: '`dark:bg-sky-500`',
      correct: true,
      explanation:
        '`dark:` varyantı yalnızca koyu tema koşulu varken ilgili utility’yi uygular; öneksiz zemin temel haldir.',
    },
    {
      text: '`hover:bg-sky-800`',
      correct: false,
      explanation: '`hover:` rengi işaretçi öğenin üzerindeyken değiştirir; tema koşulu değildir.',
    },
    {
      text: '`bg-sky-700`',
      correct: false,
      explanation:
        'Öneksiz class temel zemin rengini seçer; `.dark` durumuna özel class ise `dark:` ile başlar.',
    },
  ],
})
