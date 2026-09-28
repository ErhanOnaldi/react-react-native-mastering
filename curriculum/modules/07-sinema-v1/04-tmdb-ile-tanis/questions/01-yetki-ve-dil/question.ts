import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'TMDB isteği neden 401 döndü?',
  difficulty: 'kolay',
  concepts: ['fetch.headers-auth', 'fetch.query-params', 'fetch.error-handling'],
  question:
    '`/movie/550?language=tr-TR` isteği 401 ve `{ status_code: 7, status_message: "Invalid API key" }` döndü. Türkçe başlıkla veri almak için hangi değişiklik gerekir?',
  options: [
    {
      text: '`Authorization: Bearer <Read Access Token>` başlığı eklemek',
      correct: true,
      explanation:
        'Doğru. `language` çeviri tercihini söyler; erişim yetkisi için Bearer token ayrı bir başlıktadır.',
    },
    {
      text: '`language=tr-TR` değerini kaldırmak',
      explanation:
        'Dil parametresi yetki sağlamaz veya engellemez. Kaldırırsan Türkçe başlık isteğini de kaybedersin.',
    },
    {
      text: '`status_code: 7` değerini URL’ye eklemek',
      explanation:
        '`status_code` sunucunun hata gövdesindeki teşhis bilgisidir; istek parametresi değildir.',
    },
    {
      text: '`fetch` sonucuna doğrudan `.json()` çağırmak',
      explanation:
        'Gövdeyi okumak 401 durumunu başarılı hale getirmez. Önce yetki başlığı, sonra `response.ok` kontrolü gerekir.',
    },
  ],
})
