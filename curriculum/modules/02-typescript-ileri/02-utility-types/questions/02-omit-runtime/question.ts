import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Omit nesneyi değiştirir mi?',
  difficulty: 'kolay',
  concepts: ['ts.omit', 'js.spread'],
  question: '`Omit<Movie, "id">` kullanınca çalışma zamanındaki nesneye ne olur?',
  options: [
    {
      text: 'Hiçbir şey; yalnızca TypeScript görünümü değişir.',
      correct: true,
      explanation: 'Doğru; gerçekten silmek için yeni nesne üretmelisin.',
    },
    {
      text: '`id` otomatik silinir.',
      explanation: 'TypeScript tipleri JavaScript çıktısından silinir; nesneye dokunmaz.',
    },
    {
      text: 'Nesne readonly olur.',
      explanation: 'Readonly başka bir yardımcı tiptir; Omit alan seçimini değiştirir.',
    },
  ],
})
