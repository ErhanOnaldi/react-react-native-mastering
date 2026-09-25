import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: "Literal görünüm seçimi",
  difficulty: 'kolay',
  concepts: ["ts.literal", "ts.functions"],
  files: ['viewLabel.ts'],
  hints: ["Mode yalnızca iki değerden biridir.", "Birini koşulda ayırınca diğer dal bellidir.", "Ternary ile iki etiketi döndür."],
})
