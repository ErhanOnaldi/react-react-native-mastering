import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  "type": "quiz",
  "title": "Varyant tipi nereden gelir?",
  "difficulty": "kolay",
  "concepts": [
    "tailwind.cva",
    "ts.union"
  ],
  "question": "`buttonVariants` içinde `variant: primary | secondary | ghost` var. Hangi yaklaşım `variant=\"danger\"` yazımını tip kontrolünde yakalar?",
  "options": [
    {
      "text": "`VariantProps<typeof buttonVariants>` ile props tipini türetmek",
      "correct": true,
      "explanation": "cva tablosundaki literal seçenekler TypeScript props tipine yansır."
    },
    {
      "text": "`variant: string` yazmak",
      "correct": false,
      "explanation": "Serbest string `danger` değerini de kabul eder; tablo ile tip bağı kopar."
    },
    {
      "text": "Tüm class’ları düz string olarak yazmak",
      "correct": false,
      "explanation": "Class string’i runtime görünümü belirler ama izin verilen prop değerlerini tiplemez."
    }
  ]
})
