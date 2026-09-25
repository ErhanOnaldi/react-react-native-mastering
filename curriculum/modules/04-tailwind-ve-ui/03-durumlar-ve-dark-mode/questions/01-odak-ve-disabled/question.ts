import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Odak ile görünümü ayır',
  difficulty: 'kolay',
  concepts: ['tailwind.states', 'a11y.basics'],
  question:
    'Favori düğmesi klavyeyle seçildiğinde görünür olmalı ve devre dışıyken gerçekten tıklanmamalı. Hangisi gerekir?',
  options: [
    {
      text: '`focus-visible:*` class’ları ve gerçek `disabled` niteliği',
      correct: true,
      explanation: 'Odak görünümü CSS ile, devre dışı davranışı HTML niteliğiyle sağlanır.',
    },
    {
      text: 'Yalnız `hover:*` ve `opacity-50`',
      correct: false,
      explanation:
        'Hover klavye odağı değildir; opacity tıklamayı veya klavye etkileşimini kapatmaz.',
    },
    {
      text: '`dark:*` ve `aria-hidden="true"`',
      correct: false,
      explanation:
        'Dark tema odağı çözmez; `aria-hidden` düğmeyi erişilebilirlik ağacından saklar.',
    },
  ],
})
