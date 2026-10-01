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
      text: '`vi.fn` ile yanıtı ve çağrı argümanlarını belirleyip `fetch`i geçici olarak değiştiririm',
      correct: true,
      explanation:
        'HTTP sınırını kontrol eder; hem çağrı argümanlarını hem cevabı belirleyebilirsin.',
    },
    {
      text: 'Client modülünü tamamen mock’layıp `get` fonksiyonunun çağrıldığını doğrularım',
      correct: false,
      explanation:
        'Bu, client’ın içindeki URL ve başlık kurulumunu atlar; gerçek client fonksiyonunun ağ isteğini ölçmez.',
    },
    {
      text: '`fetch`i izler, gerçek TMDB isteğini gönderir ve sadece cevap gövdesini karşılaştırırım',
      correct: false,
      explanation:
        'Gerçek ağa bağlı kalınca token, ağ durumu ve değişen cevaplar test sonucunu etkiler.',
    },
    {
      text: '`Response.json(...)` sonucunu doğrudan client’a verip `fetch`i çalıştırmam',
      correct: false,
      explanation:
        'Client yanıtı `fetch` üzerinden alır; bu sınır çalışmazsa isteğin URL ve başlıkları da ölçülmez.',
    },
  ],
})
