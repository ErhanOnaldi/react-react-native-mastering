import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çakışmada ne kalır?',
  difficulty: 'kolay',
  concepts: ['tailwind.cn', 'js.string-formatting'],
  question:
    'Çağrıdan sonra hangi string oluşur? `clsx("rounded p-2", true && "bg-sky-700", "p-4")` sonucu `twMerge` içine giriyor.',
  options: [
    {
      text: '`rounded bg-sky-700 p-4`',
      correct: true,
      explanation:
        '`clsx` koşullu class’ı ekler, sonra `twMerge` önceki padding değerini son değerle değiştirir.',
    },
    {
      text: '`rounded p-2 bg-sky-700 p-4`',
      correct: false,
      explanation:
        'Bu, `twMerge` öncesindeki haldir; aynı padding kararına ait eski değer son çıktıda kalmaz.',
    },
    {
      text: '`rounded bg-sky-700 p-2`',
      correct: false,
      explanation:
        '`twMerge` aynı property grubundaki son class’ı tutar; burada son padding değeri `p-4`.',
    },
  ],
})
