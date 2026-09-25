import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Esnek kart",
  "difficulty": "kolay",
  "concepts": [
    "react.composition"
  ],
  "question": "Bir kartın altına bazen favori, bazen puan düğmesi konacak. Hangi API daha uygundur?",
  "options": [
    {
      "text": "`actions?: ReactNode` slot’u",
      "correct": true,
      "explanation": "Üst bileşen istediği eylemi yerleştirir, kart çerçeveyi yönetir."
    },
    {
      "text": "Her eylem için ayrı boolean prop",
      "correct": false,
      "explanation": "Varyant sayısı büyüdükçe kombinasyon ve koşul sayısı artar."
    },
    {
      "text": "Kartın içinde tüm eylemleri koşulsuz üretmek",
      "correct": false,
      "explanation": "Kullanılmayan eylemler de görünür; kart gereksiz iş bilgisi taşır."
    }
  ]
})
