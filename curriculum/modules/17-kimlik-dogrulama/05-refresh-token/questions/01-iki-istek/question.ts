import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'İki 401, kaç refresh?',
  difficulty: 'orta',
  concepts: ['auth.refresh', 'js.async-await'],
  question:
    'Profil ve hesap rozeti aynı anda 401 aldı. DummyJSON refresh token’ı tek kullanımlık. İki isteğin sağlıklı devamı için kaç `/auth/refresh` isteği gerekir?',
  options: [
    {
      text: 'Bir; ikisi aynı bekleyen refresh Promise’ını paylaşır.',
      correct: true,
      explanation:
        'Tek uçuşla token yalnız bir kez döner; iki orijinal istek yeni access token ile tekrarlanır.',
    },
    {
      text: 'İki; her 401 kendi token çiftini alır.',
      explanation: 'İlk refresh eski token’ı tüketir; ikinci aynı token ile 403 alır.',
    },
    {
      text: 'Sıfır; 401’i yok sayıp cache gösterilir.',
      explanation: 'Eski cache yetki hatasını çözmez ve başka kullanıcı verisini gösterebilir.',
    },
  ],
})
