import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Utility class’ları oku',
  difficulty: 'kolay',
  concepts: ['tailwind.utilities', 'react.jsx'],
  question:
    '`className="rounded-lg px-4 py-2 bg-sky-700"` içindeki `px-4` ve `py-2` neyi değiştirir?',
  options: [
    {
      text: 'Yatay ve dikey iç boşluğu',
      correct: true,
      explanation: '`px` yatay, `py` dikey padding verir; değerler Tailwind ölçeğindedir.',
    },
    {
      text: 'Sırasıyla genişlik ve yükseklik',
      correct: false,
      explanation: 'Genişlik için `w-*`, yükseklik için `h-*` kullanılır; `p` padding demektir.',
    },
    {
      text: 'Sadece büyük ekrandaki boşluğu',
      correct: false,
      explanation: 'Responsive class için `sm:` gibi bir önek gerekir; burada yok.',
    },
  ],
})
