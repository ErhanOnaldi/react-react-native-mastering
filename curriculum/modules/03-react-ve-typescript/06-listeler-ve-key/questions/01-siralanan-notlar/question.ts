import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Sıralanan notlar",
  "difficulty": "kolay",
  "concepts": [
    "react.lists-keys"
  ],
  "question": "Film listesi sıralanınca uncontrolled input’taki not başka filme taşınıyor. En olası sebep nedir?",
  "options": [
    {
      "text": "Satırlar key olarak index kullanıyor.",
      "correct": true,
      "explanation": "Index sıraya aittir; film kimliğine ait değildir."
    },
    {
      "text": "Film id’si key olarak kullanılıyor.",
      "correct": false,
      "explanation": "Sabit id, React’in DOM’u aynı filme bağlamasına yardım eder."
    },
    {
      "text": "Liste `map` ile kuruluyor.",
      "correct": false,
      "explanation": "map liste oluşturmanın normal yoludur; sorun kararsız kimliktedir."
    }
  ]
})
