import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Token hangi utility’yi üretir?",
  "difficulty": "kolay",
  "concepts": [
    "tailwind.theme",
    "tailwind.utilities"
  ],
  "question": "V4 CSS dosyasında `@theme { --color-brand-700: #075985; }` tanımladın. Hangi class bu rengi arka plan olarak kullanır?",
  "options": [
    {
      "text": "`bg-brand-700`",
      "correct": true,
      "explanation": "`--color-*` namespace’i renk utility’lerini üretir; `bg-*` arka planı seçer."
    },
    {
      "text": "`background-brand-700`",
      "correct": false,
      "explanation": "Tailwind arka plan rengi için `bg-*` önekini kullanır."
    },
    {
      "text": "`bg-[#075985]` zorunludur",
      "correct": false,
      "explanation": "Arbitrary value çalışabilir ama token tanımladıysan `bg-brand-700` tekrar kullanım sağlar."
    }
  ]
})
