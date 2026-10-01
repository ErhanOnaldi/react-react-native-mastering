import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Sonradan gelen filmi bul',
  difficulty: 'kolay',
  concepts: ['test.async', 'fetch.loading-states'],
  question: 'TMDB yanıtından sonra başlık DOM’a eklenecek. En doğrudan sorgu hangisi?',
  options: [
    {
      text: 'await screen.findByRole("heading", { name: "Dövüş Kulübü" })',
      correct: true,
      explanation: 'findBy asenkron olarak öğenin gelmesini bekler.',
    },
    {
      text: 'screen.getByRole("heading", { name: "Dövüş Kulübü" })',
      explanation: 'getBy hemen arar; istek henüz bitmediyse hata verir.',
    },
    {
      text: 'await new Promise(r => setTimeout(r, 1000))',
      explanation: 'Sabit bekleme hem yavaş hem makine hızına bağlıdır.',
    },
  ],
})
