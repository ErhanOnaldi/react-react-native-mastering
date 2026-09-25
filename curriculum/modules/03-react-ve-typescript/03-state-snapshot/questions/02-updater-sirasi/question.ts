import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Updatere ne gelir?",
  "difficulty": "orta",
  "concepts": [
    "react.state-snapshot"
  ],
  "question": "`setCount(n => n + 1)` aynı olayda üç kez çağrılırsa updater’ların aldığı değerler hangileridir?",
  "options": [
    {
      "text": "0, 1, 2",
      "correct": true,
      "explanation": "React sıradaki updater’a öncekinin sonucunu verir."
    },
    {
      "text": "0, 0, 0",
      "correct": false,
      "explanation": "Bu, closure’daki `count` için doğru olurdu; updater parametresi sıradaki değerdir."
    },
    {
      "text": "1, 2, 3",
      "correct": false,
      "explanation": "Parametre işlemden önceki değerdir; sonuçlar 1, 2, 3 olur."
    }
  ]
})
