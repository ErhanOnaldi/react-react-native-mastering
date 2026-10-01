import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Token hangi utility’yi üretir?',
  difficulty: 'kolay',
  concepts: ['tailwind.theme', 'tailwind.utilities'],
  question:
    'CSS içinde `@theme { --color-brand-700: #075985; }` tanımlı. `className="text-brand-700 bg-white"` olan başlıkta hangi renk metne uygulanır?',
  options: [
    {
      text: '`#075985`',
      correct: true,
      explanation:
        '`text-brand-700`, `--color-brand-700` tokenini metin renginde kullanır; `bg-white` zemin rengidir.',
    },
    {
      text: '`#075985` zemin rengi olur',
      correct: false,
      explanation: '`text-*` metin rengini seçer; token bu örnekte zemine uygulanmıyor.',
    },
    {
      text: '`bg-white` ile iki renk de metne uygulanır',
      correct: false,
      explanation: '`bg-*` zemin rengini seçer; her utility kendi CSS özelliğini belirler.',
    },
  ],
})
