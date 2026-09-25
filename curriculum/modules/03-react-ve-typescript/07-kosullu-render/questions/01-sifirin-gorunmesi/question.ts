import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Sıfırın görünmesi",
  "difficulty": "kolay",
  "concepts": [
    "react.conditional-rendering"
  ],
  "question": "`count` 0 iken `{count && <p>favori</p>}` ne render eder?",
  "options": [
    {
      "text": "0 metnini",
      "correct": true,
      "explanation": "`&&` sol değeri döndürür; React sayıyı metin olarak gösterir."
    },
    {
      "text": "Hiçbir şey",
      "correct": false,
      "explanation": "Boolean false gizlenir ama sayı 0 gösterilir."
    },
    {
      "text": "favori paragrafını",
      "correct": false,
      "explanation": "0 falsy olduğu için sağ taraf değerlendirilmez."
    }
  ]
})
