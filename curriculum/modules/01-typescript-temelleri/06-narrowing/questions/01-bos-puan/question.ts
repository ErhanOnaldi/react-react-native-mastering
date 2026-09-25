import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: "Boş puan ve varsayılan",
  difficulty: 'kolay',
  concepts: ['ts.narrowing'],
  question: "`vote` 0 olabiliyor. `if (vote) ...` neden dikkat ister?",
  options: [
    { text: "0 da falsy olduğu için “değer yok” dalına gider.", correct: true, explanation: "0 sayı olarak geçerlidir; niyetin oy yoksa `=== 0` yaz." },
    { text: "TypeScript 0 değerini null’a çevirir.", explanation: "TypeScript çalışma zamanında değeri dönüştürmez." },
    { text: "`if` yalnızca null için çalışır.", explanation: "Truthy/falsy kontrolü 0 ve boş string gibi değerleri de kapsar." }
  ],
})
