import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Formun varsayılanı",
  "difficulty": "kolay",
  "concepts": [
    "react.events"
  ],
  "question": "Sinema arama formunda Enter’a basınca sayfa yenileniyor. Handler’da hangi adım gerekir?",
  "options": [
    {
      "text": "FormEvent içinde preventDefault çağırmak.",
      "correct": true,
      "explanation": "Tarayıcının varsayılan form gönderimini durdurur."
    },
    {
      "text": "Input değerini `target` üzerinde mutasyona uğratmak.",
      "correct": false,
      "explanation": "Bu submit’i durdurmaz; controlled değer state’ten gelmelidir."
    },
    {
      "text": "Her submit’te yeni bir key üretmek.",
      "correct": false,
      "explanation": "Key form gönderme davranışıyla ilgili değildir."
    }
  ]
})
