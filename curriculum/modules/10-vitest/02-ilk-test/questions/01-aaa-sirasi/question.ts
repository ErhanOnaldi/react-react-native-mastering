import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'AAA sırasını oku',
  difficulty: 'kolay',
  concepts: ['test.aaa', 'test.vitest-basics'],
  question: `Aşağıdaki testte adımlar hangi sırada gerçekleşir?

\`\`\`ts
const vote = 8
const label = formatVote(vote)
expect(label).toBe('8.0')
\`\`\``,
  options: [
    {
      text: 'Girdiyi 8 olarak hazırla → `formatVote(8)` çağır → sonucu `"8.0"` ile karşılaştır',
      correct: true,
      explanation: 'Arrange veriyi kurar, Act davranışı çalıştırır, Assert gözlenen sonucu sınar.',
    },
    {
      text: 'Önce değeri biçimlendir → girdiyi seç → çıkan stringi doğrula',
      correct: false,
      explanation:
        'Girdi fonksiyon çağrısından önce hazırlanır; assertion da çağrıdan sonra çalışır.',
    },
    {
      text: 'Önce çıktıyı doğrula → sonra fonksiyonu çağır → en son girdiyi hazırla',
      correct: false,
      explanation: 'Sonuç henüz üretilmeden doğrulama yapılamaz; çağrıdan önce girdi hazır olmalı.',
    },
  ],
})
