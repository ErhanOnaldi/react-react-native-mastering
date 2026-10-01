import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Paylaşılan Promise’ı oku',
  difficulty: 'orta',
  concepts: ['auth.refresh', 'js.async-await'],
  question:
    'İki profil isteği de 401 aldı. İlkinde `inFlight` boş olduğu için `refreshSession()` çağrıldı. İkinci isteğin ulaştığı anda `inFlight` doluysa şu kodda kaç refresh çağrısı yapılır?\n\n```ts\nif (!inFlight) inFlight = refreshSession()\nconst tokens = await inFlight\n```',
  options: [
    {
      text: 'Bir; ikinci istek var olan Promise’ı bekler.',
      correct: true,
      explanation:
        'Tek uçuşla token yalnız bir kez döner; iki orijinal istek yeni access token ile tekrarlanır.',
    },
    {
      text: 'İki; `await` her çağrıda refresh fonksiyonunu yeniden çalıştırır.',
      explanation:
        '`await` yalnızca eldeki Promise’ın sonucunu bekler; yeni Promise üretmek için fonksiyonu çağırmak gerekir.',
    },
    {
      text: 'Sıfır; ikinci istek `inFlight` dolu görünce hata verir.',
      explanation: 'Kod dolu değeri kullanmayı sürdürüyor; bu dalda hata fırlatma yok.',
    },
  ],
})
