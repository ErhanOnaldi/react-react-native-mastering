import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Çıkışta eski profil',
  difficulty: 'orta',
  concepts: ['query.useQuery', 'auth.token-storage', 'redux.store'],
  question:
    'Emily çıkış yaptıktan sonra yeni kullanıcı giriş yapıyor. Eski profilin bir an görünmemesi için en doğru çıkış adımı hangisi?',
  options: [
    {
      text: 'Auth ve kullanıcıya ait store state’ini sıfırla, token’ları sil, `queryClient.clear()` çağır.',
      correct: true,
      explanation: 'Bellek, kalıcı kopya ve Query cache aynı oturum sınırında temizlenir.',
    },
    {
      text: 'Yalnız login sayfasına yönlendir.',
      explanation: 'Yönlendirme bellekteki eski token ve cache’i silmez.',
    },
    {
      text: 'Yalnız `invalidateQueries()` çağır.',
      explanation:
        'Invalidation eski veriyi cache’te tutabilir ve yeniden çekme başlatabilir; çıkışta clear gerekir.',
    },
  ],
})
