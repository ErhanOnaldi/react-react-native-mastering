import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Dış sınır neresi?',
  difficulty: 'kolay',
  concepts: ['test.mocks', 'fetch.headers-auth'],
  question:
    '`tmdbClient.get` içinde gerçek TMDB’ye çıkmadan URL ve Bearer başlığını ölçmek istiyorsun. Hangi sınırı değiştirirsin?',
  options: [
    {
      text: '`vi.fn` ile sahte `fetch` kurup `vi.stubGlobal("fetch", fake)` kullanırım',
      correct: true,
      explanation:
        'HTTP sınırını kontrol eder; hem çağrı argümanlarını hem cevabı belirleyebilirsin.',
    },
    {
      text: '`expect` fonksiyonunu mock’larım',
      correct: false,
      explanation: 'Assertion aracını değiştirmek, `fetch` davranışını kontrol etmez.',
    },
    {
      text: 'Gerçek TMDB’ye gidip cevabın bugün aynı olmasını beklerim',
      correct: false,
      explanation: 'Ağ ve veri değişebilir; test kararsız ve token’a bağımlı olur.',
    },
  ],
})
