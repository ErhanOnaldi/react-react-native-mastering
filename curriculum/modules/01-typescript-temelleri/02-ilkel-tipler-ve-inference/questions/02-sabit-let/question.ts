import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: "Sabit ve let farkı",
  difficulty: 'kolay',
  concepts: ['ts.literal'],
  question: "`const view = \"grid\"` ve `let mode = \"grid\"` için hangi yorum doğru?",
  options: [
    { text: "view dar `\"grid\"`, mode geniş `string` olarak çıkarılır.", correct: true, explanation: "const yeniden atanmaz; let farklı metinlere atanabilir." },
    { text: "İkisi de `number` olur.", explanation: "Tırnak içindeki değer string’dir." },
    { text: "İkisi de yalnızca `\"grid\"` kabul eder.", explanation: "let için başka string atama mümkün olduğundan tip genişler." }
  ],
})
