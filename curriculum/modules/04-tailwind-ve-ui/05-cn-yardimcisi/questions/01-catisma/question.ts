import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çakışmada ne kalır?',
  difficulty: 'kolay',
  concepts: ['tailwind.cn', 'js.string-formatting'],
  question:
    '`cn("rounded p-2", active && "bg-sky-700", "p-4")` çağrısında `active = true`. `cn` önce `clsx`, sonra `twMerge` kullanıyor. Padding class’ı hangisi?',
  options: [
    {
      text: '`p-4`',
      correct: true,
      explanation: '`twMerge` aynı padding alanındaki çatışmayı ayıklar ve son girdiyi tutar.',
    },
    {
      text: '`p-2 p-4` birlikte kalır',
      correct: false,
      explanation: '`clsx` tek başına ikisini tutardı; `twMerge` çatışmayı çözer.',
    },
    {
      text: '`p-2`; CSS’te önce görünen kazanır',
      correct: false,
      explanation: 'CSS önceliği JSX class sırasına göre belirlenmez; `cn` son girdiyi seçer.',
    },
  ],
})
