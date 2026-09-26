import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Öne çıkan kart iki sütun kaplasın',
  difficulty: 'orta',
  concepts: ['tailwind.layout', 'shadcn.theming'],
  question:
    'Modül 4’te eşit poster grid’i kurmuştun. Burada dar ekranda tek sütun, geniş ekranda üç sütun var; öne çıkan `Card` geniş ekranda iki sütun kaplamalı. Kapsayıcı ve öne çıkan kart için doğru class çifti hangisi?',
  options: [
    {
      text: 'Kapsayıcı: `grid grid-cols-1 gap-4 lg:grid-cols-3`; öne çıkan kart: `lg:col-span-2`',
      correct: true,
      explanation:
        'Doğru. Sütun sayısı kapsayıcıda, iki sütun kaplama kararı öne çıkan kartta yaşar; dar ekranda kart yine tek sütundur.',
    },
    {
      text: 'Kapsayıcı: `flex-col lg:grid-cols-3`; öne çıkan kart: `lg:col-span-2`',
      correct: false,
      explanation:
        '`grid-cols-3` ve `col-span-2` grid yerleşimi ister; kapsayıcıda `grid` display yok.',
    },
    {
      text: 'Kapsayıcı: `grid grid-cols-3`; öne çıkan kart: `col-span-2`',
      correct: false,
      explanation:
        'Üç sütun ve iki sütun kaplama dar ekranda da uygulanır; küçük ekran için tek sütun gereksinimini bozabilir.',
    },
  ],
})
