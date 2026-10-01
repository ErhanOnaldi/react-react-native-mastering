import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Yenilemede hangi state kalır?',
  difficulty: 'kolay',
  concepts: ['auth.token-storage', 'redux.store'],
  question:
    'Sinema access token’ı yalnız Redux store’da tutuyor. Sayfa yenilenince store yeniden başlıyor; profil sayfası token’ı nereden alabilir?',
  options: [
    {
      text: 'Hiçbir yerden; token yalnız bellekteydi ve sayfa yenilenince kayboldu.',
      correct: true,
      explanation: 'Bellekteki state yenilemeyle gider; kalıcılık ayrıca kurulmalıdır.',
    },
    {
      text: 'JWT olduğu için tarayıcı token’ı otomatik geri yükler.',
      explanation:
        'JWT yalnız token biçimidir; tarayıcının saklama veya geri yükleme davranışını değiştirmez.',
    },
    {
      text: 'Redux store açılırken sunucu token’ı belleğe geri yazar.',
      explanation:
        'Redux kendiliğinden sunucuya bağlanmaz; token yeniden alınacaksa uygulamanın akışı bunu yapmalıdır.',
    },
  ],
})
