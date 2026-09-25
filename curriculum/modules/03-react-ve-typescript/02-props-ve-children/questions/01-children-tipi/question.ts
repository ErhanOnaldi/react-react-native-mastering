import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Çocuk içerik",
  "difficulty": "kolay",
  "concepts": [
    "react.children"
  ],
  "question": "Bir kartın `children` alanı hem metin hem JSX ikon kabul etmeli. Hangi tip uygun?",
  "options": [
    {
      "text": "ReactNode",
      "correct": true,
      "explanation": "ReactNode metin ve React elementleri dahil render edilebilir içeriği kapsar."
    },
    {
      "text": "string",
      "correct": false,
      "explanation": "string ikon gibi JSX elementini dışlar."
    },
    {
      "text": "Movie",
      "correct": false,
      "explanation": "Movie veri nesnesidir; render edilebilir çocuk içerik tipi değildir."
    }
  ]
})
