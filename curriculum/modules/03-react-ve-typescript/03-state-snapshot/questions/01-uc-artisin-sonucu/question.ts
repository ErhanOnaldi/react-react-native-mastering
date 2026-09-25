import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Üç artışın sonucu",
  "difficulty": "kolay",
  "concepts": [
    "react.state-snapshot"
  ],
  "question": "`count` 0 iken aynı handler içinde üç kez `setCount(count + 1)` çağrılırsa sonraki render’da sayı kaç olur?",
  "options": [
    {
      "text": "1",
      "correct": true,
      "explanation": "Üç çağrı da aynı render’daki 0 değerinden 1 üretir."
    },
    {
      "text": "3",
      "correct": false,
      "explanation": "`count` handler içinde her satırda artmaz; updater kullanırsan üç artar."
    },
    {
      "text": "0",
      "correct": false,
      "explanation": "Handler bittikten sonra güncelleme uygulanır ve sayı 1 olur."
    }
  ]
})
