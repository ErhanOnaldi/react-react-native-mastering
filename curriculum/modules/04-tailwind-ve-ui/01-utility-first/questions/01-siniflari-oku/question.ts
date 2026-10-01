import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Utility class’ları oku',
  difficulty: 'kolay',
  concepts: ['tailwind.utilities', 'react.jsx'],
  question:
    '`className="px-4 py-2 text-sm"` kullanan bir film etiketi dar görünüyor. Hangi değişiklik yalnızca yatay iç boşluğu artırır?',
  options: [
    {
      text: '`px-6` yapmak',
      correct: true,
      explanation:
        '`px-*` yatay iç boşluğu değiştirir; `py-2` dikey boşluğu ve `text-sm` yazı boyunu korur.',
    },
    {
      text: '`py-6` yapmak',
      correct: false,
      explanation: '`py-*` üst ve alt iç boşluğu değiştirir; yatay boşluk için `px-*` gerekir.',
    },
    {
      text: '`text-lg` yapmak',
      correct: false,
      explanation: '`text-lg` yazı boyunu değiştirir; boşluk class’larına dokunmaz.',
    },
  ],
})
