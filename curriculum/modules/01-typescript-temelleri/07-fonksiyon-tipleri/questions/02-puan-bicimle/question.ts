import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: "Puanı ortak fonksiyonda biçimle",
  difficulty: 'kolay',
  concepts: ["ts.functions", "ts.narrowing"],
  files: ['formatScore.ts'],
  hints: ["0 için ayrı dönüş yap.", "Diğer sayılarda `toFixed` kullan.", "İkinci parametreye varsayılan 1 ver."],
})
