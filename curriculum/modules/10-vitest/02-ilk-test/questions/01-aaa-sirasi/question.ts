import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'AAA sırasını oku',
  difficulty: 'kolay',
  concepts: ['test.aaa', 'test.vitest-basics'],
  question: '`formatVote(8)` için Arrange–Act–Assert hangi sıradır?',
  options: [
    {
      text: 'Girdiyi 8 olarak hazırla → `formatVote(8)` çağır → sonucu `"8.0"` ile karşılaştır',
      correct: true,
      explanation: 'Arrange veriyi kurar, Act davranışı çalıştırır, Assert gözlenen sonucu sınar.',
    },
    {
      text: 'Önce `expect` yaz → sonra fonksiyonu çağır → en son veriyi seç',
      correct: false,
      explanation: 'Assertion için gerçekleşen sonuca ihtiyaç vardır; girdi çağrıdan önce seçilir.',
    },
    {
      text: 'Fonksiyonun içindeki `toFixed` çağrısını say → sonucu varsay',
      correct: false,
      explanation: 'İç çağrı sayısı görüntülenen `"8.0"` sözleşmesinin yerini tutmaz.',
    },
  ],
})
