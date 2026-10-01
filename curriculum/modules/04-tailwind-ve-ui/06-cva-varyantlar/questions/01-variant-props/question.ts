import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Varyant tipi nereden gelir?',
  difficulty: 'kolay',
  concepts: ['tailwind.cva', 'ts.union'],
  question:
    'Bu tanımda `variant` için hangi değer kabul edilir? `const styles = cva("rounded", { variants: { variant: { primary: "bg-sky-700", ghost: "bg-transparent" } } })`',
  options: [
    {
      text: '`primary` veya `ghost`',
      correct: true,
      explanation: 'cva tablosundaki `variant` anahtarları bu eksenin seçeneklerini tanımlar.',
    },
    {
      text: 'Herhangi bir string',
      correct: false,
      explanation:
        'Props tipi türetilirken cva tablosunda olmayan `danger` gibi değerler kabul edilmez.',
    },
    {
      text: '`primary` ve `ghost` birlikte',
      correct: false,
      explanation:
        'Tek bir varyant çağrısında bu eksenden bir seçenek seçilir; iki değer birden verilmez.',
    },
  ],
})
